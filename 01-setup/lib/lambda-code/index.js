const Aws = require('aws-sdk')

exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const s3 = new Aws.S3();

    // for this example, we'll just do a simple ACL read of the Bucket;
    // of course, in a  real application,
    // you would use the Bucket to store and retrieve data
    const bucketDetails = await s3.getBucketAcl({
        Bucket: process.env.BUCKET_NAME,
    }).promise();

    return bucketDetails.Owner;
}
