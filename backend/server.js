require('dotenv').config()
const express = require('express')
const app = express()
PORT = process.env.PORT 
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/configDB')
const { mongo, default: mongoose } = require('mongoose')

connectDB()
mongoose.set("strictQuery",true)
app.use(express.static(path.join(__dirname,'public')))
app.use(cors())
app.use(express.json())
app.use('/',require('./routes/root'))
app.all('*',(req,res)=>{
    res.status(404)
    res.sendFile(path.join(__dirname,'views','404.html'))
})

mongoose.connection.once('open',(req,res)=>{
    console.log('mongodb is connected')
    app.listen(PORT,()=>{
        console.log(`server is running on ${PORT}`)
    })

})

mongoose.connection.on('err',(err)=>{
    console.log(err)
})