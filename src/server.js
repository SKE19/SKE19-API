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

app.use('/', (req, res) => {
    res.json(skeData)
})

readCsv(process.env.DATA_PATH).then(() => {
    
    const server = http.createServer(app)

    server.listen(process.env.PORT, () => {
        console.log(skeData)
        console.log(`Server started at port ${process.env.PORT}`)
    })

})

/* exports = Object.freeze({
    server: http.createServer(app)
    init: () => {
        return readCsv(process.env.DATA_PATH).then(() => {
            this.
            })
        })
    }
})
*/