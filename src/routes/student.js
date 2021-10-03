const express = require('express')
const router = express.Router()
const { skeData } = require('../server') 

router.get('/', (req, res) => {
    if(!req.body.id){
        return res.status(500).json({ "error": "No ID is provided." })  
    }
    if(skeData.students[req.body.id]){
        res.json(skeData.students[req.body.id])
    } else {
        res.status(404)
        res.json({ "error": "No student of that ID is found." })
    }
})

router.get('/:id', (req, res) => {
    if(skeData.students[req.params.id]){
        res.json(skeData.students[req.params.id])
    } else {
        res.status(404)
        res.json({ "error": "No student of that ID is found." })
    }
})

module.exports = router