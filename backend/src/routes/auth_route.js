import express from 'express';
import { 
  google, 
  signin, 
  signup, 
  verifyEmail, 
  resendVerificationEmail 
} from '../controllers/auth_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

// ✅ Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;