// ============================================================
//  models/Booking.js
// ============================================================
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  guests: {
    type: String,
    default: '2 People',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  source: {
    type: String,
    default: 'website',
  },
}, {
  timestamps: true,
});

BookingSchema.index({ date: 1, status: 1 });
BookingSchema.index({ phone: 1 });

module.exports = mongoose.model('Booking', BookingSchema);