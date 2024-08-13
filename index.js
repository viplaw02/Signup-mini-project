const express = require('express');
const app = express();
const dbconnect = require('./config/dbconnect').dbconnect();
const auth = require('./routess/auth');
require('dotenv').config();
 
app.use(express.json());
app.use('/api/v1',auth);
PORT = process.env.PORT || 4000

app.get('/',(req,res)=>{
    res.send("<h1>welcome</h1>")
})


app.listen(PORT,()=>{
    console.log(`server has started on this ${PORT}`);
})








