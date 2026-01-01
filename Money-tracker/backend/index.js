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

app.post('/backend/transaction', async (req, res) => {
    //connect to db
    await mongoose.connect(process.env.MONGO_URL);
    const {name, price ,desc, date} = req.body;//retrieve data user inserted
    const transaction = await Transaction.create({name, price, desc, date});

    res.json(transaction);//send user data to db
})

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})