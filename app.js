//we are requiring our packages into app.js
const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidate = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session')({
//Express session middle ware
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
//The above keeps track of the different users that have successfully accessed the system according to their sessions.
});

const passport = require('passport');

//we are qualifying config to be a package but config package is our own i.e we just created it.
const config = require('./config/database');

//creating models (these are controllers)
// const editSignupRoutes = require('./routes/editSignupRoute')
const indexpageRoutes = require('./routes/indexpageRoute')
const loginRoutes = require('./routes/loginRoute')
const homeRoutes = require('./routes/homeRoute')
const signupRoutes = require('./routes/signupRoute')
const batteryHireRoutes = require('./routes/batteryHireRoute')
// const revenueEntryRoutes = require('./routes/revenueEntryRoute')
const vehicleEntryRoutes = require('./routes/vehicleEntryRoute')
const receiptRoutes = require('./routes/receiptRoute')
const tyreClinicRoutes = require('./routes/tyreClinicRoute')

//creating a variable for express(we are instatiating our server).
const app = express();

//creating a connection to the mongo database from the controller(specifying its location)
mongoose.connect(config.database);
//incase of a connection we are creating a variable for the database. 
const db = mongoose.connection;
//Incase of a connection
db.once('open', ()=> {
    console.log('Connected to mongodb');
})
//Or else the connection fails
db.on('error', (err)=> {
    console.error('Connection error',err)
}) 

//setting up the view engine
app.engine('html', require('html').__express)
app.set('view engine','html')
app.set('views', path.join(__dirname,'views'))

//bodyparser middleware section: This helps to clean data that is within the forms.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//express flash middle ware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// setting directory for static files
app.use(express.static(path.join(__dirname, 'public')));


//password configuration
require('./config/passport')(passport);

//passport middle ware
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
//* means all. 
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Instructing the controller to point the login file.
// @ this line below we are using middleware
// app.use('/editSignup',homeRoutes)
app.use('/indexpage',indexpageRoutes)
app.use('/login',loginRoutes)
app.use('/home',homeRoutes)
app.use('/signup',signupRoutes)
app.use('/batteryHire',batteryHireRoutes)
app.use('/receipt',receiptRoutes)
// app.use('/revenue',revenueRoutes)
app.use('/vehicle',vehicleRoutes)
app.use('/tyreClinic',tyreClinicRoutes)

//This is a post route middleware whereas we are using the same variable that we created for indexRoutes for it to work
// app.use('/form/submit',indexRoutes)

//Establishing the server listening port
app.listen(1000, ()=> {
    console.log('The server has started on port 1000')
})

