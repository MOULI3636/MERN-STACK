const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google Login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google Callback
router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/',
    successRedirect: 'http://localhost:3000/dashboard'
  })
);

// Logout - FIXED VERSION
router.get('/logout', (req, res) => {
  console.log('Logout called');
  
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    // Destroy session
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destroy error:', err);
      }
      
      // Clear cookie
      res.clearCookie('connect.sid');
      
      // Send success response
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// Check auth status
router.get('/status', (req, res) => {
  res.json({ 
    authenticated: !!req.user,
    user: req.user || null 
  });
});

module.exports = router;
