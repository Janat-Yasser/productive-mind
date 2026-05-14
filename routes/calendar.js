const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const calendarController = require('../controllers/calendarController');

router.get('/', ensureAuth, calendarController.getMonthView);
router.get('/week', ensureAuth, calendarController.getWeekView);
router.get('/day', ensureAuth, calendarController.getDayView);

module.exports = router;
