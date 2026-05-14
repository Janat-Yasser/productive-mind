const Task = require('../models/Task');

const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  // Pad start
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
};

exports.getMonthView = async (req, res) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) !== undefined ? parseInt(req.query.month) : now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: firstDay, $lte: lastDay }
    }).sort({ dueDate: 1 });

    // Map tasks to date keys
    const taskMap = {};
    tasks.forEach(t => {
      if (t.dueDate) {
        const key = t.dueDate.toDateString();
        if (!taskMap[key]) taskMap[key] = [];
        taskMap[key].push(t);
      }
    });

    const days = getMonthDays(year, month);
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    res.render('calendar/month', {
      title: `${monthNames[month]} ${year} — Productive Mind`,
      days, taskMap, year, month,
      monthName: monthNames[month],
      today: now,
      prevYear: month === 0 ? year - 1 : year,
      prevMonth: month === 0 ? 11 : month - 1,
      nextYear: month === 11 ? year + 1 : year,
      nextMonth: month === 11 ? 0 : month + 1,
      view: 'calendar'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
};

exports.getWeekView = async (req, res) => {
  try {
    const now = new Date();
    const startDate = req.query.start ? new Date(req.query.start) : (() => {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0,0,0,0);
      return d;
    })();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: startDate, $lte: endDate }
    }).sort({ dueDate: 1 });

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toDateString();
      days.push({ date: d, tasks: tasks.filter(t => t.dueDate && t.dueDate.toDateString() === key) });
    }

    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - 7);
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + 7);

    res.render('calendar/week', {
      title: 'Week View — Productive Mind',
      days, startDate, endDate,
      today: now,
      prevStart: prevStart.toISOString().split('T')[0],
      nextStart: nextStart.toISOString().split('T')[0],
      view: 'calendar'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/calendar');
  }
};

exports.getDayView = async (req, res) => {
  try {
    const now = new Date();
    const date = req.query.date ? new Date(req.query.date) : now;
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: date, $lt: nextDay }
    }).sort({ dueTime: 1 });

    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const nextD = new Date(date);
    nextD.setDate(nextD.getDate() + 1);

    res.render('calendar/day', {
      title: `${date.toDateString()} — Productive Mind`,
      tasks, date,
      today: now,
      prevDay: prevDay.toISOString().split('T')[0],
      nextDay: nextD.toISOString().split('T')[0],
      view: 'calendar'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/calendar');
  }
};
