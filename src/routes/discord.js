const express = require('express')
const router = express.Router()
const { skeData } = require('../server')
const { dynamo, error, success } = require('../util/aws')

router.get('/', (req, res) => {
    if(!req.body.studentId){
        return res.status(500).json({
            message: "No SKE19 student ID provided."
        })
    }
    if(!skeData.students[req.body.studentId]){
        return res.status(404).json({
            message: "No SKE19 student of that ID is found."
        })
    }
    let params = {
        TableName: "ske19.users",
        Key: {
            "std_id": req.body.studentId
        }
    }
    dynamo.get(params, (err, data) => {
        if(err){
            error(err, res)
        } else {
            if(!data.Item){
                return res.status(404).json({
                    message: "That student hasn't registered within Discord yet."
                })
            }
            res.json({ids: data.Item.discord_ids})
        }
    })
})

router.post('/new', (req, res) => {
    if(!req.body.discordId){
        return res.status(500).json({
            message: "No Discord ID provided."
        })
    }
    if(!req.body.studentId){
        return res.status(500).json({
            message: "No SKE19 student ID provided."
        })
    }
    if(!skeData.students[req.body.studentId]){
        return res.status(404).json({
            message: "No SKE19 student of that ID is found."
        })
    }
    let params = {
        TableName: "ske19.users",
        Key: {
            "std_id": req.body.studentId
        }
    }
    dynamo.get(params, (err, data) => {
        if(err){
            return error(err, res)
        } else {
            if(!data.Item){
                let _params = {
                    TableName: "ske19.users",
                    Item: {
                        "std_id": req.body.studentId,
                        "discord_ids": [req.body.discordId],
                        "created_on": new Date().toString(),
                        "updated_on": new Date().toString()
                    }
                }
                dynamo.put(_params, (_err, _data) => {
                    if(_err){
                        return error(_err, res)
                    } else {
                        dynamo.get(params, (__err, __data) => {
                            if(__err){
                                return error(__err, res)
                            } else {
                                return success(__data, res)
                            }
                        })
                    } 
                })
            } else {
                if(data.Item.discord_ids.length >= process.env.MAX_DISCORD_COUNT){
                    return res.status(500).json({
                        message: "Maximum Discord IDs has been registered with this student."
                    })
                }
                let newDiscordList = data.Item.discord_ids
                newDiscordList.push(req.body.discordId)
                let _params = {
                    TableName: "ske19.users",
                    Key: {
                        "std_id": req.body.studentId,
                    },
                    UpdateExpression: "set discord_ids = :ds, updated_on = :up",
                    ExpressionAttributeValues: {
                        ":ds": newDiscordList,
                        ":up": new Date().toString(),
                    }
                }
                dynamo.update(_params, (_err, _data) => {
                    if(_err){
                        return error(_err, res)
                    } else {
                        dynamo.get(params, (__err, __data) => {
                            if(__err){
                                return error(__err, res)
                            } else {
                                return success(__data, res)
                            }
                        })
                    }
                })
            }
        }
    })
})

router.delete('/delete', (req, res) => {
    if(!req.body.discordId){
        return res.status(500).json({
            message: "No Discord ID provided."
        })
    }
    if(!req.body.studentId){
        return res.status(500).json({
            message: "No SKE19 student ID provided."
        })
    }
    if(!skeData.students[req.body.studentId]){
        return res.status(404).json({
            message: "No SKE19 student of that ID is found."
        })
    }
    let params = {
        TableName: "ske19.users",
        Key: {
            "std_id": req.body.studentId
        }
    }
    dynamo.get(params, (err, data) => {
        if(err){
            return error(err, res)
        } else {
            if(!data.Item){
                return res.status(404).json({
                    message: "That student hasn't registered within Discord yet."
                })
            }
            if(!data.Item.discord_ids.includes(req.body.discordId)){
                return res.status(500).json({
                    message: "That Discord ID isn't linked with this student!"
                })
            }
            let newDiscordList = data.Item.discord_ids
            newDiscordList = newDiscordList.filter((val, index, arr) => {
                return val != req.body.discordId
            })
            let _params = {
                TableName: "ske19.users",
                Key: {
                    "std_id": req.body.studentId,
                },
                UpdateExpression: "set discord_ids = :ds, updated_on = :up",
                ExpressionAttributeValues: {
                    ":ds": newDiscordList,
                    ":up": new Date().toString(),
                }
            }
            dynamo.update(_params, (_err, _data) => {
                if(_err){
                    return error(_err, res)
                } else {
                    dynamo.get(params, (__err, __data) => {
                        if(__err){
                            return error(__err, res)
                        } else {
                            return success(__data, res)
                        }
                    })
                }
            })
        }
    })
})

module.exports = router