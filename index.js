const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Server = http.createServer(app)
const dotenv = require('dotenv')
const mysql2 = require('mysql2')
//const mysql = require('mysql')

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Huzaifa@123',
    database: 'employee',
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
  });

module.exports = { connection, app };

require('./db');
const employee = require('./routes/employee')

app.use('/api',employee)

//require('./employee');

//module.exports = connection

const port = process.env.PORT || 8080
dotenv.config()

app.use(morgan('dev'))
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('Server Running')
})

Server.listen(port,()=>{console.log(`Server Running on port ${port}`)})
