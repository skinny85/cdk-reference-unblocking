const Aws = require('aws-sdk');

exports.handler = async function (event) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const dynamoDb = new Aws.DynamoDB();

    // in this example, we'll just do a simple DescribeTable call;
    // of course, in a  real application,
    // you would use the Table to store and retrieve data
    const tableDetails = await dynamoDb.describeTable({
        TableName: process.env.TABLE_NAME,
    }).promise();

    return tableDetails.Table;
}
