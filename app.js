if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const db_url = process.env.DB_URL;
const secret =  process.env.SECRET || 'thisshouldbebettersecret' ;
// const db_url = "mongodb://localhost:27017/hotel101" ;

const express = require("express");
const app = express();
const path = require("path");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const session = require('express-session');
const MongoStore = require('connect-mongo');


const flash = require("connect-flash");

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const hotelRoutes = require("./routes/hotels");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const mongoose = require("mongoose");
const {
  getMaxListeners
} = require("./models/user");

app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret,
  },
  touchAfter:24*60*60 ,
});

store.on( "error" , function(e){
    console.log( "Session Error" );
} )

const sessionConfig = {
  store,
  name:'session' ,
  secret ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    HttpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect( db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!!");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



app.use("/hotels/:id/reviews", reviewRoutes);
app.use("/hotels", hotelRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  // console.log(err);
  const {
    status = 500, message = "Gadbad"
  } = err;
  if (!err.message) err.message = "Somthing is Wrong";
  res.status(status).render("partials/error", {
    err
  });
});

const port = process.env.PORT || 3000 ;

app.listen( port , () => {
  console.log("Started Port " + port );
});