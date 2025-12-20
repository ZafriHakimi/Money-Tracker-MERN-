const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TransactionSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    desc: {type: String, required: true},
    date: {type: Date, required: true},
});

const TransModel = model('Transaction', TransactionSchema);

module.exports = TransModel;