// ============================================================
//  YOSHI ヨシ — Express Server
//  Node.js + Express + MongoDB (Mongoose)
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
require('dotenv').config();

// ── APP INITIALIZATION ──
const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE (প্রথমে middleware বসাতে হবে) ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yoshi-secret-key-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
}));

// ── STATIC FILES ──
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════
//  IMAGE UPLOAD SYSTEM (মেনু আইটেমের জন্য ছবি আপলোড)
// ═══════════════════════════════════════════════════════════

// আপলোড ফোল্ডার তৈরি করুন (যদি না থাকে)
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Uploads folder created');
}

// স্টোরেজ কনফিগারেশন
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ফাইল ফিল্টার - শুধু ইমেজ অনুমোদন
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'));
  }
};

// Multer কন�িগারেশন
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB লিমিট
  fileFilter: fileFilter
});

// ── ইমেজ আপলোড API ──
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('📸 Image uploaded:', req.file.filename);
    
    // ইমেজ অপটিমাইজ করুন (sharp ব্যবহার করে)
    const optimizedFilename = 'optimized-' + req.file.filename;
    const optimizedPath = path.join(uploadDir, optimizedFilename);
    
    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(optimizedPath);
    
    // পুরানো (অনঅপটিমাইজড) ফাইল ডিলিট করুন
    fs.unlinkSync(req.file.path);
    
    // URL রিটার্ন করুন
    const imageUrl = `/uploads/${optimizedFilename}`;
    console.log('✅ Image optimized and saved:', imageUrl);
    
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: optimizedFilename
    });
    
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ── ইমেজ ডিলিট API (ঐচ্ছিক) ──
app.delete('/api/upload/:filename', async (req, res) => {
  try {
    const filepath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'Image deleted' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// আপলোড করা ফাইলগুলোর জন্য স্ট্যাটিক রাউট
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ═══════════════════════════════════════════════════════════

// ── MONGODB CONNECTION ──
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yoshi')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ── ROUTES (middleware এর পরে routes বসাতে হবে) ──
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));

// ── SPA FALLBACK ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ──
app.listen(PORT, () => {
  console.log(`🍜 YOSHI server running at http://localhost:${PORT}`);
  console.log(`📁 Uploads folder: ${uploadDir}`);
});

module.exports = app;