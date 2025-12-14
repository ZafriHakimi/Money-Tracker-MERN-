const express = require('express');
const cors = require('cors');
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.get('/backend/test', (req, res) => {
    res.send('test ok');
})

app.post('/backend/transaction', (req, res) => {
    res.json(req.body)
})

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})