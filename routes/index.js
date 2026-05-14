const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/tasks');
  res.render('index', { layout: 'layouts/landing', title: 'Productive Mind — Own Your Day' });
});

module.exports = router;
