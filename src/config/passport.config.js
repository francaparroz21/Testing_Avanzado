import passport from 'passport';
import local from 'passport-local';
import { userModel } from '../dao/models/users.model.js';
import { createHash, validatePassword } from '../utils/utils.js';
import GitHubStrategy from 'passport-github2';
import { config } from './config.js';
import { cartService } from '../repository/index.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email'}, async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                let user = await userModel.findOne({email:username}); 
                if(user || email === config.auth.account){ 
                    console.log('User already exist');
                    return done(null,false);
                }else{ 
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: "user",
                        cart: await cartService.addCart()
                    };
                    let result = await userModel.create(newUser);
                    return done(null, result);
                }
            } catch (error) { 
                return done("Error ocurred when try to register: " + error);
            }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        try{
            let user;
            if(id === 0){
                user = {
                    _id: 0, 
                    first_name: 'Administrador',
                    last_name: 'Del Sistema',
                    email: config.auth.account,
                    age: 99,
                    role: 'admin'
                };
            }else{
                user = await userModel.findById(id);
            }
            done(null, user)
        } catch (error) {
            done(error, null);
        }
        
    });

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (email, password, done)=>{
        try {
            let user;
            if(email == config.auth.account && password == config.auth.pass){
                user = {
                    _id: 0,
                    first_name: 'Administrador',
                    last_name: 'Del Sistema',
                    email: email,
                    age: 99,
                    role: 'admin'
                };
                return done(null, user);
            }else{
                user = await userModel.findOne({email});
                if(!user){
                    console.log("El usuario no existe")
                    return done(null, false);
                }else{
                    if(!validatePassword(password,user)) return done (null, false);
                    console.log("Todo ok")
                    return done(null, user);
                }
            }
        } catch (error) {
            console.log("Todo RE MAL");
            return done("Error ocurred when try to login: " + error);   
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: config.auth.clientId,
        clientSecret: config.auth.clientSecret,
        callbackURL: config.auth.callbackUrl,
        scope: ["user:email"]
        },
        async (accesToken, refreshToken, profile, done)=>{
            try {    
                const email = profile.emails[0].value;
                let user = await userModel.findOne({email: email});
                
                if(!user){
                    const newUser = {
                            first_name: profile._json.name,
                            last_name:'',
                            email,
                            age: 18,
                            password: '',
                            cart: await cartService.addCart(),
                            role: 'user' 
                    }
                    const result = await userModel.create(newUser);
                    done(null, result);
                }else{
                    done(null, user);
                }
            } catch (error) {
                return done(null, error);
            }
        }
    ));

}

export default initializePassport;