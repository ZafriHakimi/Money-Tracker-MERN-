const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.get('/backend/test', (req, res) => {
    res.send('test ok');
})

app.post('/backend/transaction', (req, res) => {
    //connect to db
    console.log(process.env.MONGO_URL);
    //mongoose.connect('')
    const {name, desc, date} = req.body;
    res.json(req.body)
})

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})