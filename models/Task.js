const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['personal', 'work', 'health', 'learning', 'finance', 'other'], default: 'personal' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  dueDate: { type: Date, default: null },
  dueTime: { type: String, default: '' },
  tags: [{ type: String }],
  isRecurring: { type: Boolean, default: false },
  recurringPattern: { type: String, enum: ['daily', 'weekly', 'monthly', ''], default: '' },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

TaskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'done') return false;
  return new Date(this.dueDate) < new Date();
});

TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', TaskSchema);
