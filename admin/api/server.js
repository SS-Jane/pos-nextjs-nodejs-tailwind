const express = require('express');
const userController = require('./controller/userController');
const bodyParser = require('body-parser')
const core = require('cors')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.use(core())


app.post('/api/user/signIn', (req,res) => userController.signIn(req,res))

app.listen(3001, ()=>{
    console.log('Listen at localhost port 3001');
    
})