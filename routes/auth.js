const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ensureGuest, ensureAuth } = require('../middleware/auth');

// GET /auth/signin
router.get('/signin', ensureGuest, (req, res) => {
  res.render('auth/signin', { layout: 'layouts/auth', title: 'Sign In — Productive Mind' });
});

// POST /auth/signin
router.post('/signin', ensureGuest, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth/signin',
    failureFlash: true
  })(req, res, next);
});

// GET /auth/signup
router.get('/signup', ensureGuest, (req, res) => {
  res.render('auth/signup', { layout: 'layouts/auth', title: 'Create Account — Productive Mind' });
});

// POST /auth/signup
router.post('/signup', ensureGuest, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('password2').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/signup', {
      layout: 'layouts/auth',
      title: 'Create Account — Productive Mind',
      errors: errors.array(),
      name: req.body.name,
      email: req.body.email
    });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return res.render('auth/signup', {
        layout: 'layouts/auth',
        title: 'Create Account — Productive Mind',
        errors: [{ msg: 'Email is already registered.' }],
        name: req.body.name,
        email: req.body.email
      });
    }

    const user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
    await user.save();
    req.flash('success_msg', 'Account created! Please sign in.');
    res.redirect('/auth/signin');
  } catch (err) {
    console.error(err);
    res.render('auth/signup', {
      layout: 'layouts/auth',
      title: 'Create Account — Productive Mind',
      errors: [{ msg: 'Server error. Please try again.' }]
    });
  }
});

// POST /auth/logout
router.post('/logout', ensureAuth, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You have been signed out.');
    res.redirect('/auth/signin');
  });
});

module.exports = router;
