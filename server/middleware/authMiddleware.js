import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'module';
import User from '../models/User.js';

const require = createRequire(import.meta.url);
const serviceAccount = require('../serviceAccountKey.json');

// Initialize firebase-admin if not already done
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}


export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Local Developer bypass/mock to make local testing easier
      if (token === 'dev-admin-token') {
        let adminUser = await User.findOne({ username: 'FitGirl' });
        if (!adminUser) {
          adminUser = await User.create({
            username: 'FitGirl',
            email: 'admin@fitgirl.site',
            firebaseUid: 'dev-admin-uid',
            isAdmin: true
          });
        }
        req.user = adminUser;
        return next();
      }

      if (token === 'dev-user-token') {
        let testUser = await User.findOne({ username: 'gamer99' });
        if (!testUser) {
          testUser = await User.create({
            username: 'gamer99',
            email: 'gamer@example.com',
            firebaseUid: 'dev-user-uid',
            isAdmin: false
          });
        }
        req.user = testUser;
        return next();
      }

      if (token.startsWith('dev-email-token:')) {
        const testEmail = token.split(':')[1];
        let testUser = await User.findOne({ email: testEmail });
        if (!testUser) {
          testUser = await User.create({
            username: testEmail.split('@')[0],
            email: testEmail,
            firebaseUid: `dev-uid-${testEmail}`,
            isAdmin: testEmail === 'dhamodhar200@gmail.com' || testEmail === 'admin@fitgirl.site'
          });
        }
        req.user = testUser;
        return next();
      }

      // Standard production Firebase validation
      const decodedToken = await getAuth().verifyIdToken(token);
      
      // Find or create user in MongoDB based on verified token
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (!user) {
        const adminEmails = ['admin@fitgirl.site', 'dhamodhar200@gmail.com'];
        user = await User.create({
          username: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          firebaseUid: decodedToken.uid,
          isAdmin: adminEmails.includes(decodedToken.email)
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Firebase token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
