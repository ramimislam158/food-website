// ============================================================
//  routes/categories.js
// ============================================================
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
// const { requireAdmin } = require('../middleware/auth'); // সাময়িকভাবে বন্ধ রাখুন

// ── PUBLIC ROUTES ──────────────────────────────────────────

// GET /api/categories - all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/all - all categories (including inactive)
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN ROUTES (সবার জন্য খোলা - পরে আবার requireAdmin যোগ করবেন) ──

// POST /api/categories - create new category
router.post('/', async (req, res) => {
  try {
    const { name, icon, order, description, isActive } = req.body;
    
    console.log('Creating category:', name); // ডিবাগ লাইন
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Category with similar name already exists' });
    }
    
    const category = new Category({
      name,
      slug,
      icon: icon || '🍽',
      order: order || 0,
      description: description || '',
      isActive: isActive !== false
    });
    
    await category.save();
    console.log('Category created:', category);
    res.status(201).json(category);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/categories/:id - update category
router.put('/:id', async (req, res) => {
  try {
    const { name, icon, order, description, isActive } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    console.log('Updating category:', name);
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, icon, order, description, isActive },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/categories/:id - delete category
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting category:', req.params.id);
    
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;