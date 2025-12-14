const express = require('express');

const app = express();

app.get('/api/test', (req, res) => {
    res.send('test ok 2');
})

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000')
})