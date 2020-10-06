const Aws = require('aws-sdk')

exports.handler = async function (event) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const dynamoDb = new Aws.DynamoDB();

    const tableDetails = await dynamoDb.describeTable({
        TableName: process.env.TABLE_NAME,
    }).promise();

    return tableDetails.Table;
}
