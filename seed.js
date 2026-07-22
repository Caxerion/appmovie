require('dotenv').config();
const pool = require('./config/db');

async function seed() {
  try {
    const categoryNames = ['Action', 'Comedy', 'Drama', 'Horror'];
    const movies = [
      { title: 'Avengers Doomsday', year: 2026, categoryName: 'Action' },
      { title: 'Inception', year: 2010, categoryName: 'Action' },
      { title: 'The Hangover', year: 2009, categoryName: 'Comedy' },
      { title: 'Forrest Gump', year: 1994, categoryName: 'Drama' },
      { title: 'The Conjuring', year: 2013, categoryName: 'Horror' }
    ];

    for (const name of categoryNames) {
      await pool.execute('INSERT IGNORE INTO categories (name) VALUES (?)', [name]);
    }

    const [rows] = await pool.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    for (const row of rows) {
      categoryMap[row.name] = row.id;
    }

    for (const m of movies) {
      const categoryId = categoryMap[m.categoryName];
      const [existing] = await pool.execute('SELECT id FROM movies WHERE title = ?', [m.title]);
      if (existing.length === 0) {
        await pool.execute(
          'INSERT INTO movies (title, year, categoryId) VALUES (?, ?, ?)',
          [m.title, m.year || null, categoryId || null]
        );
      }
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
