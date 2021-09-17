require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const csv = require('csv-parser')
const http = require('http')
const { json } = require('express')

const app = express()

let skeData = { students : {} }

function readCsv(filepath){
    return new Promise((resolve, reject)=>{
        fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (row) => {
            skeData['students'][row['studentId']] = {
                firstNameEN: row['nameEN'].split(" ")[0],
                lastNameEN: row['nameEN'].split(" ")[1],
                nickEN: row['nickEN'],
                firstNameTH: row['nameTH'].split(" ")[0],
                lastNameTH: row['nameTH'].split(" ")[1],
                nickTH: row['nickTH'],
                email: row['email'],
                instagram: '@' + row['instagram']
            }
        })
        .on('end', () => {
            resolve()
        })
        .on('error', reject)
    })
}

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
    res.json({ "github": "https://github.com/SKE19" })
})

app.get('/students', (req, res) => {
    res.json(skeData)
})

app.get('/student', (req, res) => {
    res.status(500)
    res.json({ "error": "No ID is provided." })
})

app.get('/student/:id', (req, res) => {
    if(skeData.students[req.params.id]){
        res.json(skeData.students[req.params.id])
    } else {
        res.status(404)
        res.json({ "error": "No student of that ID is found." })
    }
})

readCsv(process.env.DATA_PATH).then(() => {
    const server = http.createServer(app)
    server.listen(process.env.PORT, () => {
        console.log(`Server started at port ${process.env.PORT}`)
    })
    exports.students = skeData
})