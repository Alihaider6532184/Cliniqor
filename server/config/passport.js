const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user);
      }

      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (email) {
        user = await User.findOne({ email: email });
        if (user) {
          // User exists with email, link the account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        email: email,
        // name: profile.displayName // You might want to add a name field to your user model
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, false);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (user) {
        return done(null, user);
      }
      
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (email) {
        user = await User.findOne({ email: email });
        if (user) {
          // User exists with email, link the account
          user.facebookId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      const newUser = new User({
        facebookId: profile.id,
        email: email,
        // name: `${profile.name.givenName} ${profile.name.familyName}`
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
}); 