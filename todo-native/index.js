const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({ database: 'todo_app' });

app.get('/todos', async (req, res) => {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
})

app.post('/todos', async (req, res) => {
    const { task } = req.body;
    await pool.query('INSERT INTO todos (task) VALUES ($1)', [task]);
    res.sendStatus(201);
})

app.listen(3000, () => console.log('Running on http://localhost:3000'));