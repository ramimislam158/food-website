// ============================================================
//  models/MenuItem.js (Fully Dynamic - No enum restrictions)
// ============================================================
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: 100,
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    // ✅ No enum - এখন যেকোনো category value গ্রহণ করবে
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: 400,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  spiceLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  tags: [String],
}, {
  timestamps: true,
});

// Indexes for better query performance
MenuItemSchema.index({ category: 1, available: 1 });
MenuItemSchema.index({ featured: -1, createdAt: -1 });
MenuItemSchema.index({ name: 'text' }); // text search on name

module.exports = mongoose.model('MenuItem', MenuItemSchema);