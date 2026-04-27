// ============================================================
//  models/Category.js
// ============================================================
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: 50,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '🍽',
    maxlength: 2,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    maxlength: 200,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', CategorySchema);