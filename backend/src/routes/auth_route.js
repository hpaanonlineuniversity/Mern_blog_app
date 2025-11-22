// routes/auth_route.js
import express from 'express';
import { 
  google, 
  signin, 
  signup, 
  verifyEmail, 
  resendVerificationEmail,
  forgotPassword,    
  resetPassword      
} from '../controllers/auth_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

// ✅ Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);


// ✅ Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;