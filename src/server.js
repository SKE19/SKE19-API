require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const csv = require('csv-parser')
const http = require('http')
const https = require('https')
const { json } = require('express')

const app = express()

let skeData = { students : {} }

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i') // fragment locator
    return !!pattern.test(str)
}

function readCsv(filepath){
    return new Promise((resolve, reject)=>{
        if (validURL(filepath)) {
            https.get(filepath, res => {
                res.pipe(csv())
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
        } else {
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
        }
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
    console.log(skeData)
    const server = http.createServer(app)
    server.listen(process.env.PORT, () => {
        console.log(`Server started at port ${process.env.PORT}`)
    })
})