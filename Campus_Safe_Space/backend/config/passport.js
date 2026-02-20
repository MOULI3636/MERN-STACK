const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          const randomId = 'User' + Math.floor(1000 + Math.random() * 9000);
          
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0]?.value || 'https://via.placeholder.com/150',
            anonymousId: randomId,
            profession: 'Student'
          });
          console.log('✅ New user created:', user.email);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('❌ Google Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
