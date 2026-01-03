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

//add transactions to db
app.post('/backend/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {price ,desc, date} = req.body;//retrieve data user inserted
    const transaction = await Transaction.create({price, desc, date});

    res.json(transaction);//send user data to db
})

//display all transactions, get from db(model)
app.get('/backend/transaction_list', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transaction_list = await Transaction.find();

    res.json(transaction_list);//send db data to user
})

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})