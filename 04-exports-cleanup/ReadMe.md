In [part 3](../03-synthetic-exports),
we updated the resource shared between the two Stacks from an S3 Bucket to a DynamoDB Table.
But to achieve that, we had to introduce these ugly "synthetic exports"
into our code that have very specific, weird names.
Does this mean we need to keep these ugly `CfnOutput`s cluttering our CDK app forever?
Fortunately, no!

The "synthetic exports" were only needed to move past the deployment failure of the producing Stack.
Once fixed, that deployment also updated the consuming Stack,
removing references to the previously shared resource
(the S3 Bucket).
This means the exports in the producing Stack can now be safely deleted,
as there is nothing referencing them anymore.

The file [src/app.ts](src/app.ts) illustrates that.
It's almost identical to the [file in part 3](../03-synthetic-exports/src/app.ts),
except the "synthetic exports" have been removed
(as well as the S3 Bucket, as it's no longer needed).

You can safely deploy this version:

```shell script
$ cd ../04-exports-cleanup
$ yarn cdk deploy '*'
```

This completes the process of changing a cross-stack reference!

## Cleaning up the Stacks

To not incur unnecessary charges,
you can now remove the deployed Stacks from your AWS account:

```shell script
$ yarn cdk destroy '*'
```
