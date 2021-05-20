const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const port = process.argv[2] || 5000
const app = express()
var RouterData = require('./src/router/Data');

app.use(bodyParser.json())
app.use(cors());    
app.use('/api/data', RouterData);
app.listen(port, () => console.log('Server running on', port));
