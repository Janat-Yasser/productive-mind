require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// DB Connection
const connectDB = require('./config/db');
connectDB();

// Passport config
require('./config/passport')(passport);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/productive-mind',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global vars middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));
app.use('/calendar', require('./routes/calendar'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { layout: 'layouts/main', title: '404 - Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Productive Mind running on http://localhost:${PORT}`));
