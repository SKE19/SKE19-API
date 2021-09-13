require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()

server.use(cors())

server.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`)
})