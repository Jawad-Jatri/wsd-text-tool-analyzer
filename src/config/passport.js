const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require("../config");
const {findOrCreateUserByEmail} = require("../services/userService");

passport.use(
    new GoogleStrategy(
        {
            clientID: config.oauth.googleClientId,
            clientSecret: config.oauth.googleClientSecret,
            callbackURL: `${config.oauth.callbackUrl}`,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await findOrCreateUserByEmail(profile.displayName, profile._json.email, profile.id || profile._json.id);
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = {id};
    done(null, user);
});

module.exports = passport;