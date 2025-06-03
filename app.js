var express = require('express')
var bodyParser = require('body-parser')
require('dotenv').config()

var app = express()
app.use(bodyParser.json())
// app.use(express.raw({ type: 'application/json' }));
app.use(bodyParser.raw({ type: 'application/json' }));


app.get('/', function (req, res) {
  res.send('Hello World')
})

const db = require("./app/models")
// db.sequelize.sync();

const userRouter = require('./app/routes/users.routes');
app.use(userRouter)


var PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}!`);
})
