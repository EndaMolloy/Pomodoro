const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const localStrategy = require('passport-local').Strategy
const  googlePlusTokenStrat = require('passport-google-plus-token')

const User = require('./models/user')


//Extracting the JWT from the request, JWT located in the header
passport.use(new JwtStrategy({
  jwtFromRequest : ExtractJwt.fromHeader('auth'),
  secretOrKey : process.env.SECRET
}, async (jwt_payload, done)=>{
  try {
    //find the user for given token
      const user = await User.findById(jwt_payload.sub)

        //if not found handle it
        if(!user){
          return done(null, false)
        }
        //Else return the user
        return done(null, user)

  } catch (err) {
      return done(err,false)
  }
}))
