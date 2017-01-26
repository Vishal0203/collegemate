const express = require('express');
const path = require('path');
const port = 7777;

const app = express();

app.use(express.static(__dirname));

app.listen(port);
console.log('server started');
