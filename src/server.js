require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const csv = require('csv-parser')
const http = require('http')
const https = require('https')
const { json } = require('express')

const auth = require('./routes/auth')
const { validateToken } = require('./routes/auth')

const app = express()

let skeData = { students : {} }
let dynamo

function validURL(str) {
    // Check if str is a valid URL.
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i') // fragment locator
    return !!pattern.test(str)
}

function readCsv(filepath){
    // Read CSV from either HTTPS or Local file path.
    return new Promise((resolve, reject)=>{
        if (validURL(filepath) && process.env.DATA_TYPE.match(new RegExp("HTTPS", "gi"))) {
            // GET over HTTPS protocol.
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
            return
        }
        // GET from local file.
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

app.use('/auth', auth)

app.get('/students', validateToken, (req, res) => {
    res.json(skeData)
})

readCsv(process.env.DATA_PATH).then(() => {
    // Server startup.
    const server = http.createServer(app)
    server.listen(process.env.PORT, () => {
        console.log(`Server started at port ${process.env.PORT}`)
        if(process.env.ENABLE_AWS === "true"){
            dynamo = require("./util/aws").dynamo
            console.log(`AWS is enabled in .env: DynamoDB client created.`)
        }
    })
}).then(() => {
    // Exporting skeData for use with other JS.
    exports.skeData = skeData
}).then(() => {
    // JS that required skeData should be put here, such as routers.
    // Explicit but it works!
    const studentRouter = require('./routes/student')
    const discordRouter = require('./routes/discord')
    app.use('/student', validateToken, studentRouter)
    if(process.env.ENABLE_AWS === "true"){
        app.use('/discord', validateToken, discordRouter)
    }
})