const express = require('express');
const app = express();
app.use(express.static('public')) // define where static assets live
const utilities = require('./routes/utility.js')


// PASSPORT INSTALLATION AND USAGE
const cors = require('cors')
const passport = require('passport'); // we will use passport.js, so include it
const session = require('express-session'); // we need to use session
const flash = require('connect-flash'); // pass messages between app and callbacks
const dotenv = require('dotenv').config() // we use a few enviornment variables
const cookieParser  = require('cookie-parser') // enable cookies

require('./config/passport')(passport); // configure passport authenticator

app.use(cors({
  credentials: true, // add Access-Control-Allow-Credentials to header
  origin: "http://localhost:3000" 
}));
app.use(cookieParser())
app.use(session({  // setup a session store signing the contents using the secret key
  secret: 'secret',
	resave: true,
	saveUninitialized: true
   }));
app.use(passport.initialize()); //middleware that's required for passport to operate
app.use(passport.session()); // middleware to store user object
app.use(flash()); // use flash to store messages


// EVERYTHING ELSE
app.use(express.json())  
app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.static('public'))	// define where static assets live


// Handlebars stuff
const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs',
  helpers: require(__dirname + "/public/js/helpers.js").helpers,
}))

app.set('view engine', 'hbs')
require('./models/db.js');

//set up vendor router
const vendorRouter = require('./routes/vendorRouter')
//set up customer router
const customerRouter = require('./routes/customerRouter');
const { partials } = require('handlebars');
const entryRouter = require('./routes/entryRouter.js');

// Handlebars.registerPartial({cartNotify: partial, navBar, partial})

// Checks if the user is logged in or not - then changes the navbar to include login/logout respectively
// Checks where user is in the URL and displays a different navbar accordingly
app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();

  let requestSegments = req.path.split('/'); // Splits url into segments
  res.locals.currentPath = requestSegments[1] 

  if (requestSegments.includes("menu")) { // If customer has selected a vendor, store the vendorId to link cart button
    if (requestSegments.includes("moreDetails")) {
      res.locals.onMenu = true
      res.locals.cartVendor = requestSegments[requestSegments.length -2]
    } else {
      res.locals.onMenu = true
      res.locals.cartVendor = requestSegments[requestSegments.length -1]
    }
  }
  next()
});

app.use('/', entryRouter);

app.get('/cart', (req, res) => {res.render('Cart')}) // GET cart page 

app.listen(process.env.PORT || 3010,function(){
  console.log("The google2.0 food app is running at PORT 3010!");
});

//Export app for testing 
module.exports=app

