const express = require('express')
const router = express.Router()
const { skeData } = require('../server')
const { dynamo, error, success } = require('../util/aws')

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
            console.log(data)
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
                console.log(newDiscordList)
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

module.exports = router