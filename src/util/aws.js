const AWS = require("aws-sdk")
let awsConfig = {
    "region": process.env.AWS_REGION,
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
}
AWS.config.update(awsConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

function handleError(err, res) {
    console.log(err)
    res.status(500).json({ message: 'DynamoDB error', error: err })
}

function handleSuccess(data, res) {
    res.status(200).json({ message: 'DynamoDB success', data: data})
}

exports.dynamo = docClient
exports.error = handleError
exports.success = handleSuccess