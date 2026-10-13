import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticate Google Sign-in on server
router.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    let decodedToken;
    let email, name, uid;

    // Handle dev environment mocks
    if (token === 'dev-admin-token') {
      email = 'admin@fitgirl.site';
      name = 'FitGirl';
      uid = 'dev-admin-uid';
    } else if (token === 'dev-user-token') {
      email = 'gamer@example.com';
      name = 'gamer99';
      uid = 'dev-user-uid';
    } else if (token.startsWith('dev-email-token:')) {
      email = token.split(':')[1];
      name = email.split('@')[0];
      uid = `dev-uid-${email}`;
    } else {
      decodedToken = await getAuth().verifyIdToken(token);
      email = decodedToken.email;
      name = decodedToken.name || email.split('@')[0];
      uid = decodedToken.uid;
    }

    // Upsert User in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      // First registered user is Admin, or if it has the admin email
      const isFirst = (await User.countDocuments({})) === 0;
      const adminEmails = ['admin@fitgirl.site', 'dhamodhar200@gmail.com'];
      user = await User.create({
        username: name,
        email: email,
        firebaseUid: uid,
        isAdmin: isFirst || adminEmails.includes(email),
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token // send back the same token to be stored on client and used in Authorization header
    });
  } catch (error) {
    console.error('Firebase Auth verification error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
});

// Verify current session
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
