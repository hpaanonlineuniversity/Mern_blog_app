// controllers/auth_controller.js

import User from '../models/user_model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import { JWT_SECRET } from '../configs/config.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Input validation
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return next(errorHandler(400, 'All fields are required'));
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(errorHandler(400, 'Invalid email format'));
    }

    // 3. Password strength validation
    if (password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters long'));
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: username.trim().toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.trim().toLowerCase()) {
        return next(errorHandler(409, 'Email already exists'));
      }
      if (existingUser.username === username.trim().toLowerCase()) {
        return next(errorHandler(409, 'Username already taken'));
      }
    }

    // 5. Hash password
    const hashedPassword = bcryptjs.hashSync(password, 12);

    // 6. Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 7. Create new user
    const newUser = new User({
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // 8. Save user to database
    await newUser.save();

    // 9. Send verification email
    try {
      await sendVerificationEmail(newUser.email, emailVerificationToken);
    } catch (emailError) {
      // Email ပို့မရရင်တောင် user create လုပ်ပေးမယ်
      console.error('Failed to send verification email:', emailError);
    }

    // 10. Remove sensitive data from response
    const { password: _, emailVerificationToken: __, ...userWithoutSensitiveData } = newUser._doc;

    // 11. Send success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification link.',
      user: userWithoutSensitiveData
    });

  } catch (error) {
    // 12. Handle specific database errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(errorHandler(409, `${field} already exists`));
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(errorHandler(400, errors.join(', ')));
    }

    // 13. Handle other errors
    next(errorHandler(500, 'Internal server error during signup'));
  }
};

// ✅ Email verification controller
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return next(errorHandler(400, 'Verification token is required'));
    }

    // Find user by verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() } // Token hasn't expired
    });

    if (!user) {
      return next(errorHandler(400, 'Invalid or expired verification token'));
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    });
  } catch (error) {
    next(errorHandler(500, 'Error verifying email'));
  }
};

// ✅ Resend verification email controller
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(errorHandler(400, 'Email is required'));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    if (user.isEmailVerified) {
      return next(errorHandler(400, 'Email is already verified'));
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new token
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, emailVerificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully. Please check your email.',
    });
  } catch (error) {
    next(errorHandler(500, 'Error resending verification email'));
  }
};

// Signin controller ကိုလည်း update လုပ်မယ်
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // ✅ Check if email is verified
    if (!validUser.isEmailVerified) {
      return next(errorHandler(403, 'Please verify your email before signing in'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google auth ကိုလည်း update လုပ်မယ်
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // ✅ Google user တွေကို auto-verify လုပ်မယ်
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isEmailVerified: true, // ✅ Google users are auto-verified
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
// ✅ Forgot Password - Reset token ပို့ပေးမယ်
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return next(errorHandler(400, 'Email is required'));
    }

    // User ရှိမရှိ စစ်မယ်
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!user) {
      // Security အတွက် user မရှိရင်လည်း success response ပြန်ပေးမယ်
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    }

    // Password reset token generate လုပ်မယ်
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // User ကို update လုပ်မယ်
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Reset email ပို့မယ်
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      
      res.status(200).json({
        success: true,
        message: 'Password reset link has been sent to your email.',
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return next(errorHandler(500, 'Failed to send reset email'));
    }

  } catch (error) {
    next(errorHandler(500, 'Error in forgot password'));
  }
};

// ✅ Reset Password - New password သတ်မှတ်မယ်
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(errorHandler(400, 'Token and new password are required'));
    }

    // Password strength check
    if (newPassword.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }

    // Token valid ဖြစ်မဖြစ် စစ်မယ်
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() } // Token မသက်တမ်းမကုန်သေး
    });

    if (!user) {
      return next(errorHandler(400, 'Invalid or expired reset token'));
    }

    // New password hash လုပ်မယ်
    const hashedPassword = bcryptjs.hashSync(newPassword, 12);

    // User update လုပ်မယ်
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });

  } catch (error) {
    next(errorHandler(500, 'Error resetting password'));
  }
};