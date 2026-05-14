const Task = require('../models/Task');

// Today's tasks
exports.getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      user: req.user._id,
      $or: [
        { dueDate: { $gte: today, $lt: tomorrow } },
        { dueDate: null, status: { $ne: 'done' } }
      ]
    }).sort({ priority: -1, createdAt: 1 });

    const stats = {
      total: tasks.length,
      done: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length
    };

    res.render('tasks/today', {
      title: 'Today — Productive Mind',
      tasks,
      stats,
      view: 'today',
      today: new Date()
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// Upcoming tasks
exports.getUpcomingTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: today },
      status: { $ne: 'done' }
    }).sort({ dueDate: 1, priority: -1 });

    // Group by date
    const grouped = {};
    tasks.forEach(task => {
      const dateKey = task.dueDate ? task.dueDate.toDateString() : 'No Date';
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(task);
    });

    res.render('tasks/upcoming', {
      title: 'Upcoming — Productive Mind',
      grouped,
      view: 'upcoming',
      today: new Date()
    });
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
};

// Utility Hub (all tasks, filtered)
exports.getUtilityHub = async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    const allTasks = await Task.find({ user: req.user._id });
    const stats = {
      total: allTasks.length,
      done: allTasks.filter(t => t.status === 'done').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      todo: allTasks.filter(t => t.status === 'todo').length,
      overdue: allTasks.filter(t => t.isOverdue).length
    };

    res.render('tasks/utility', {
      title: 'Utility Hub — Productive Mind',
      tasks,
      stats,
      view: 'utility',
      filters: { status, priority, category, search }
    });
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
};

// Add task form
exports.getAddTask = (req, res) => {
  res.render('tasks/form', {
    title: 'Add Task — Productive Mind',
    task: null,
    action: '/tasks/add',
    method: 'POST',
    view: 'today'
  });
};

// Create task
exports.postAddTask = async (req, res) => {
  try {
    const { title, description, priority, category, status, dueDate, dueTime, tags, isRecurring, recurringPattern } = req.body;
    const task = new Task({
      user: req.user._id,
      title, description, priority, category, status,
      dueDate: dueDate ? new Date(dueDate) : null,
      dueTime: dueTime || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isRecurring: isRecurring === 'on',
      recurringPattern: isRecurring === 'on' ? recurringPattern : ''
    });
    await task.save();
    req.flash('success_msg', 'Task created successfully!');
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to create task.');
    res.redirect('/tasks/add');
  }
};

// Edit task form
exports.getEditTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) { req.flash('error_msg', 'Task not found.'); return res.redirect('/tasks'); }
    res.render('tasks/form', {
      title: 'Edit Task — Productive Mind',
      task,
      action: `/tasks/${task._id}?_method=PUT`,
      method: 'POST',
      view: 'today'
    });
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
};

// Update task
exports.putUpdateTask = async (req, res) => {
  try {
    const { title, description, priority, category, status, dueDate, dueTime, tags, isRecurring, recurringPattern } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) { req.flash('error_msg', 'Task not found.'); return res.redirect('/tasks'); }

    task.title = title;
    task.description = description;
    task.priority = priority;
    task.category = category;
    task.status = status;
    task.dueDate = dueDate ? new Date(dueDate) : null;
    task.dueTime = dueTime || '';
    task.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    task.isRecurring = isRecurring === 'on';
    task.recurringPattern = isRecurring === 'on' ? recurringPattern : '';

    await task.save();
    req.flash('success_msg', 'Task updated!');
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to update task.');
    res.redirect('/tasks');
  }
};

// Toggle status (AJAX)
exports.patchUpdateStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const { status } = req.body;
    task.status = status;
    if (status === 'done') task.completedAt = new Date();
    else task.completedAt = null;
    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    req.flash('success_msg', 'Task deleted.');
    res.redirect(req.headers.referer || '/tasks');
  } catch (err) {
    req.flash('error_msg', 'Failed to delete task.');
    res.redirect('/tasks');
  }
};

// API endpoint for calendar
exports.getTasksApi = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = { user: req.user._id };
    if (start && end) filter.dueDate = { $gte: new Date(start), $lte: new Date(end) };
    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
