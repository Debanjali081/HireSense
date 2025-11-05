const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
      try {
        // Check if user already exists with this Google account
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email (any provider)
        const email = profile.emails?.[0].value;
        user = await User.findOne({ email });
        if (user) {
          // Link Google account to existing user
          user.provider = 'google';
          user.providerId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = new User({
          name: profile.displayName,
          email: email,
          provider: 'google',
          providerId: profile.id,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// Serialize user for session support (optional, if sessions used)
passport.serializeUser((user: any, done: (error: any, id?: string) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: (error: any, user?: any) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
