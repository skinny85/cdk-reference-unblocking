In the first part, we set up the scenario.
We have two Stacks: a producing Stack,
that contains an S3 Bucket;
and a consuming Stack,
which uses that Bucket in a Lambda function.
All code is in the [src/app.ts](src/app.ts) file.

Simply `cdk deploy` this part
(make sure you have credentials for your AWS account set in your terminal;
see the
[AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
if you've never done that before):

```shell script
$ cd 01-setup
$ yarn cdk deploy '*'
```

This will establish a relationship between the two Stacks.
In [part 2](../02-failed-update), we'll try to update that relationship.
