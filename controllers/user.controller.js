import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "files are required",
      });
    }

    const { avatar, resume } = req.files;

    // cloudinary setup for Avatar..
    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "AVATARS" }
    );
    // ("response from cloudinary:", cloudinaryResponseForAvatar);
    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponseForAvatar.error || "unknown error"
      );
    }
    // cloudinary setup for resume
    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "RESUMES" }
    );
    // ("response from cloudinary:", cloudinaryResponseForResume);
    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponseForResume.error || "unknown error"
      );
    }

    const {
      fullName,
      email,
      phone,
      aboutMe,
      password,
      githubURL,
      instagramURL,
      facebookURL,
      twitterURL,
      linkdinURL,
    } = req.body;

    const user = await User.create({
      fullName,
      email,
      phone,
      aboutMe,
      password,
      githubURL,
      instagramURL,
      facebookURL,
      twitterURL,
      linkdinURL,
      avatar: {
        public_id: cloudinaryResponseForAvatar.public_id,
        url: cloudinaryResponseForAvatar.secure_url,
      },
      resume: {
        public_id: cloudinaryResponseForResume.public_id,
        url: cloudinaryResponseForResume.secure_url,
      },
    });
    generateToken(user, "user regestered", 201, res);
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all fields.",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid Crendential.",
      });
    }

    const isPasswordMatch = await user.camparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid Crendiential",
      });
    }
    generateToken(user, "logged In", 200, res);
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Fetch the user once
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newUserData = {
      fullName: req.body.fullName || user.fullName,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
      aboutMe: req.body.aboutMe || user.aboutMe,
      githubURL: req.body.githubURL || user.githubURL,
      instagramURL: req.body.instagramURL || user.instagramURL,
      facebookURL: req.body.facebookURL || user.facebookURL,
      twitterURL: req.body.twitterURL || user.twitterURL,
      linkdinURL: req.body.linkdinURL || user.linkdinURL,
    };

    // Handling avatar update if provided
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      if (user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id); // Remove the old avatar
      }
      const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "AVATARS" }
      );
      newUserData.avatar = {
        public_id: cloudinaryResponseForAvatar.public_id,
        url: cloudinaryResponseForAvatar.secure_url,
      };
    }

    // Handling resume update if provided
    if (req.files && req.files.resume) {
      const resume = req.files.resume;
      if (user.resume.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id); // Remove old resume
      }
      const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: "RESUMES" }
      );
      newUserData.resume = {
        public_id: cloudinaryResponseForResume.public_id,
        url: cloudinaryResponseForResume.secure_url,
      };
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      newUserData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const id = req.user._id;
    const user = await User.findById(id).select("+password");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "please provide all fields",
        success: false,
      });
    }

    const isPasswordMatch = user.camparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Wrong current password",
        success: false,
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "password and confirm password do not match",
        success: false,
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "password updated.!",
      success: true,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const getuserPortfolio = async (req, res) => {
  try {
    const id = "6715ce50be041496a16d6f99";
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Generate reset password token
    const resetToken = user.getResetPasswordToken();

    // Save the user without running validations
    await user.save({ validateBeforeSave: false });

    // Construct reset password URL
    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

    // Compose the message
    const message = `Your Reset Password Token is: \n\n ${resetPasswordUrl} \n\n If you did not request this, please ignore it.`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Personal Portfolio Dashboard Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    error;
    // Reset user's resetPasswordToken and resetPasswordExpire in case of an error
    // const user = await User.findById(req.user?._id);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      return res.status(404).json({
        message: "password and confirm password is not matched",
        success: false,
      });
    }
    user.password = req.body.newPassword;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    generateToken(user, "reset password successfully", 200, res);
  } catch (error) {
    error;
    res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};
