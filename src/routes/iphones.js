const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Maps DB columns to API campos and vice versa
// campo1 = model      (string)
// campo2 = color      (string)
// campo3 = storage    (string)
// campo4 = stock      (integer)
// campo5 = price      (float)
// campo6 = available  (boolean)

const toApi = (row) => ({
  id:     row.id,
  campo1: row.model,
  campo2: row.color,
  campo3: row.storage,
  campo4: row.stock,
  campo5: row.price,
  campo6: row.available,
});

const validate = (body) => {
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = body;
  const errors = [];

  if (!campo1 || typeof campo1 !== 'string' || campo1.trim() === '')
    errors.push('campo1 (model) is required and must be a non-empty string');

  if (!campo2 || typeof campo2 !== 'string' || campo2.trim() === '')
    errors.push('campo2 (color) is required and must be a non-empty string');

  if (!campo3 || typeof campo3 !== 'string' || campo3.trim() === '')
    errors.push('campo3 (storage) is required and must be a non-empty string');

  if (campo4 === undefined || campo4 === null || !Number.isInteger(campo4))
    errors.push('campo4 (stock) is required and must be an integer');

  if (campo5 === undefined || campo5 === null || typeof campo5 !== 'number' || isNaN(campo5))
    errors.push('campo5 (price) is required and must be a number');

  if (campo6 === undefined || campo6 === null || typeof campo6 !== 'boolean')
    errors.push('campo6 (available) is required and must be a boolean');

  return errors;
};

// GET /iphones
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, model, color, storage, stock, price, available FROM iphones ORDER BY id ASC'
    );
    return res.status(200).json(result.rows.map(toApi));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /iphones/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, model, color, storage, stock, price, available FROM iphones WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'iPhone not found' });

    return res.status(200).json(toApi(result.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /iphones
router.post('/', async (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0)
    return res.status(400).json({ errors });

  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO iphones (model, color, storage, stock, price, available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, model, color, storage, stock, price, available`,
      [campo1.trim(), campo2.trim(), campo3.trim(), campo4, campo5, campo6]
    );
    return res.status(201).json(toApi(result.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /iphones/:id
router.put('/:id', async (req, res) => {
  const errors = validate(req.body);
  if (errors.length > 0)
    return res.status(400).json({ errors });

  const { id } = req.params;
  const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
  try {
    const result = await pool.query(
      `UPDATE iphones
       SET model=$1, color=$2, storage=$3, stock=$4, price=$5, available=$6
       WHERE id=$7
       RETURNING id, model, color, storage, stock, price, available`,
      [campo1.trim(), campo2.trim(), campo3.trim(), campo4, campo5, campo6, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'iPhone not found' });

    return res.status(200).json(toApi(result.rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /iphones/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM iphones WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'iPhone not found' });

    return res.status(200).json({ message: 'iPhone deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;