const express = require('express')
const connectDB = require('./config/db.js')

const app = express()
const port = process.env.PORT || 4000
connectDB()

//enable read data through body
app.use(express.json())


//routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/files', require('./routes/files'))


app.listen(port, '0.0.0.0', () => {
    console.log(`workinggg on port ${port}`)
})