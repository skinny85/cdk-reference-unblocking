In part 2,
we want to change the shared resource from an S3 Bucket to a DynamoDB Table.

We try to do it in the most obvious way;
we simply remove all code that references the Bucket,
both in the producing and consuming Stack,
and replace it with a DynamoDB Table.
And while the code compiles without any issues
(you can see it in the file [src/app.ts](src/app.ts)),
attempting to `yarn cdk deploy '*'` fails with an error similar to:

```
Export ProducingStack:ExportsOutputFnGetAttBucket83908E77Arn063C8555
cannot be deleted as it is in use by ConsumingStack
```

Make sure to try it yourself!

```shell script
$ cd ../02-failed-update
$ yarn cdk deploy '*'
```

You should see an error similar to above.

We'll solve this problem in [part 3](../03-synthetic-exports).
