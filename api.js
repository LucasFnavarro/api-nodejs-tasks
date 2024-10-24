// requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const mysql_config = require('./inc/mysql_config');
const functions = require('./inc/functions');

const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';
const PORT = 3333;

// iniciar o server
const app = express();
app.listen(PORT, () => { console.log(`API is running in localhost:${PORT}`); });

app.use((req, res, next) => {
    if (API_AVAILABILITY) {
        next();
    } else {
        res.json(functions.response('WARNING', 'API is in maintenance. Sorry!', 0, null));
    }
});

// mysql connection
const connection = mysql.createConnection(mysql_config);

// cors
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.json(functions.response('success', 'API is running', 0, null));
});

// ==============================================================
// endpoints
// ==============================================================
// get all tasks
app.get('/tasks', (req, res) => {
    connection.query("SELECT * FROM tasks", (err, rows) => {
        if (!err) {
            res.json(functions.response('success', 'Success', rows.length, rows))
        } else {
            res.json(functions.response('error', err.message, 0, null));
        }
    });
});

// get task by id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows) => {
        if (!err) {
            // devolvo os dados da task
            if (rows.length > 0) {
                res.json(functions.response('success', 'success', rows.length, rows));
            } else {
                res.json(functions.response('warning', 'Task not found', 0, null));
            }
        } else {
            res.json(functions.response('error', err.message, 0, null));
        }
    });
});

// update task status
app.put('/tasks/:id/status/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id], (err, rows) => {
        if (!err) {
            if (rows.affectedRows > 0) {
                res.json(functions.response('success', 'success', rows.affectedRows, null));
            } else {
                res.json(functions.response('warning', 'Task not found', 0, null));
            }
        } else {
            res.json(functions.response('error', err.message, 0, null));
        }
    });
});

// delete task
app.delete('/tasks/:id/delete', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM tasks WHERE id = ?', [id], (err, rows) => {
        if (!err) {
            if (rows.affectedRows > 0) {
                res.json(functions.response('success', 'Task deleted', rows.affectedRows, null));
            } else {
                res.json(functions.response('warning', 'Task not found', 0, null));
            }
        }
    });
});

app.use((req, res) => {
    res.json(functions.response('warning', 'Route not found', 0, null));
});
