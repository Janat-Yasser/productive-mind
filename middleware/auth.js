module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Please sign in to access this page.');
    res.redirect('/auth/signin');
  },
  ensureGuest: (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/tasks');
  }
};
