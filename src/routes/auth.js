const express = require('express')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

router.post('/', (req, res) => {
    // This generates token for using with secured routes (SHA-256)
    if(!(req.headers.secret !== undefined)){
        return res.sendStatus(403)
    } else {
        if(req.headers.secret !== process.env.SECRET_IDENTIFIER) return res.sendStatus(403)
    }
    const hasTokenHeader = (req.headers.duration !== undefined)
    let duration = 0
    if(hasTokenHeader){
        duration = (req.header('duration').match(/^\d+$/)) ? parseInt(req.header('duration')) : 3600
    } else {
        duration = 3600
    }
    const session = {
        id: uuidv4()
    }
    const token = jwt.sign({ session }, process.env.SECRET_IDENTIFIER, { algorithm: 'HS256', expiresIn: duration })
    res.json({
        token: token
    })
})

router.get('/test', validateToken, (req, res) => {
    // Testing authentication (will be removed in production)
    res.json({
        "data": res.locals.data
    })
})

function validateToken(req, res, next) {
    const header = req.headers.authorization
    if(header !== undefined) {
        const bearer = header.split(" ")
        const token = bearer[1]
        req.token = token
        jwt.verify(req.token, process.env.SECRET_IDENTIFIER, (err, data) => {
            res.locals.data = data
            if(err) {
                res.status(403)
                res.json({
                    "error": "Invalid credentials."
                })
            } else {
                next()
            }
        })
    } else {
        res.json({
            "error": "Unauthorized access."
        })
        res.sendStatus(403)
    }
}

module.exports = router
module.exports.validateToken = validateToken