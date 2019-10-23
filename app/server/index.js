const path = require('path')
const http = require('http')
const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const User = require('./user')
const API = require('bui-server/api')

const PORT = 80
global.ROOT_PATH = path.join(__dirname, '..');
global.DIST_PATH = path.join(__dirname, '..', 'dist');
global.CLIENT_PATH = path.join(__dirname, '..', 'client');
global.SERVER_PATH = path.join(__dirname, '..', 'server');

const app = express();

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done)=>{
    User.login(email, password).then(user=>{
        done(null, user)
    }, err=>{
        done(err)
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
 
passport.deserializeUser(async (id, done)=>{
    User.deserializeUser(id).then(user=>{
        done(null, user)
    }, err=>{
        done(err)
    })
});


// serve up static files from /dist and /client/public directories
app.use(express.static(DIST_PATH, {index: false}))
app.use(express.static(CLIENT_PATH+'/public', {index: false}))

// setup parsers for incoming data
app.use(require('body-parser').json({limit: '50mb'}))
app.use(require('express-fileupload')());

const session = require('express-session')
let RedisStore = require('connect-redis')(session)
let store = new RedisStore({client: require('./redis')})
 
app.use(session({
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// App Page
app.get('/', (req, res)=>{

    if( !req.isAuthenticated() )
        return res.redirect('/login')

    res.sendFile(CLIENT_PATH+'/index.html')
})

// Login Page
app.get('/login', (req, res)=>{

    if( req.isAuthenticated() ){
        return res.redirect('/')
    }

    res.sendFile(CLIENT_PATH+'/login.html')
})

// Logout Page, then redirect to login
app.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/login');
})

// AJAX Login
app.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{

        if(err) {
            return res.status(401).send({error:err.message, trace: err.trace});
        }

        req.login(user, err=>{
            if( err )
                return res.status(500).send({error:err.message, trace: err.trace});

            res.json(user);
        })

    })(req, res, next);
});

app.get('/hash-pw/:pw', async (req, res)=>{
    let hash = await User.hashPassword(req.params.pw)
    res.send(hash)
})

new API(app, [
    User
], {root: '/api'})

// start up node server
const server = http.Server(app);
server.listen(PORT, function(){console.log('\nApp running: localhost:'+process.env.APP_PORT);});
