import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
}
const app = express();
app.use(express.json());
app.use(cors(corsOptions))

const db = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tabletek'
});

app.get('/tablets', async (req, res) => {
    try {
        let [rows, fields] = await db.query('SELECT * FROM tablet');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Hiba a lekérdezésben' });
    }
});

app.post('/tablets', async (req, res) => {
    let data = [req.body.model, req.body.price, req.body.available];
    if (data[0] == "" || data[1] <= 0) {
        res.status(400).json({ error: 'Hiányzó vagy hibás adat' });
    } else {
        try {
            await db.query('INSERT INTO tablet (model, price, available) VALUES (?, ?, ?)', data);
            res.status(201).json({ message: 'Tablet sikeresen rögzítve' });
        } catch (error) {
            res.status(500).json({ error: 'Hiba a tablet rögzítése közben' });
        }
    }
});

app.delete('/tablets/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let result = await db.query('DELETE FROM tablet WHERE id = ?', [id]);
        if (result[0].affectedRows != 1) {
            res.status(404).json({ error: 'Nem létezik ilyen azonosító' });
        } else {
            res.status(200).json({ message: 'Tablet sikeresen törölve' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hiba a tablet törlése közben' });
    }
});

app.listen(3000);