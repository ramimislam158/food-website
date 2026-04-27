// ============================================================
//  routes/menu.js  — Public + Admin menu routes
// ============================================================
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuitem');
// const { requireAdmin } = require('../middleware/auth'); // সাময়িকভাবে বন্ধ রাখুন

// ── PUBLIC ──────────────────────────────────────────────────

// GET /api/menu  — fetch all available items (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;

    const items = await MenuItem.find(filter).sort({ category: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// GET /api/menu/:id  — single item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// ── ADMIN (সবার জন্য খোলা - পরে আবার requireAdmin যোগ করবেন) ──

// POST /api/menu  — create item
router.post('/', async (req, res) => {
  try {
    console.log('Creating menu item:', req.body);
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/menu/:id  — update item
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating item:', req.params.id);
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/menu/:id/toggle  — toggle availability
router.patch('/:id/toggle', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.available = !item.available;
    await item.save();
    res.json({ available: item.available, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menu/:id  — delete item
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting item:', req.params.id);
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;