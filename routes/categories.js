const express = require('express');
const router = express.Router();

// Data sementara (in-memory). Ganti ke query database kalau kamu udah pakai MySQL/Prisma.
let categories = [
  { id: 1, name: "Action" },
  { id: 2, name: "Sci-Fi" },
  { id: 3, name: "Drama" },
];
let nextId = 4;

// GET semua category
router.get('/', (req, res) => {
  res.json(categories);
});

// POST tambah category
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Nama category wajib diisi" });
  }
  const newCategory = { id: nextId++, name: name.trim() };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// PUT edit category
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return res.status(404).json({ message: "Category tidak ditemukan" });
  }
  category.name = name.trim();
  res.json(category);
});

// DELETE category
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = categories.some((c) => c.id === id);
  if (!exists) {
    return res.status(404).json({ message: "Category tidak ditemukan" });
  }
  categories = categories.filter((c) => c.id !== id);
  res.json({ message: "Category berhasil dihapus" });
});

module.exports = router;