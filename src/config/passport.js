const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require("../config");

passport.use(
    new GoogleStrategy(
        {
            clientID: config.oauth.googleClientId,
            clientSecret: config.oauth.googleClientSecret,
            callbackURL: `${config.oauth.callbackUrl}`,
        },
        (accessToken, refreshToken, profile, done) => {
            console.log('accessToken', accessToken)
            console.log('profile', profile)
            const user = {id: profile.id, displayName: profile.displayName, accessToken};
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    console.log('user', user)
    done(null, user);
});

passport.deserializeUser((id, done) => {
    // Mock user fetching logic
    const user = {id, displayName: 'John Doe'};
    done(null, user);
});

module.exports = passport;