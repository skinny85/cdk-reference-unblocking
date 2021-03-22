In part 3, we learn a trick to unblock ourselves when we encounter the dreaded
`Export cannot be deleted as it is in use by another Stack` error.
I call this trick "dummy exports".

The problem that we encountered in part 2 was that the moment the previous reference
(in our case, that's the S3 Bucket)
was removed between the Stacks,
CDK stopped generating the CloudFormation exports that made that cross-stack reference possible.
However, when CloudFormation attempted to remove those exports when deploying the producing Stack,
they were still being referenced in the old version of the consuming Stack,
and it's not possible to remove an export in CloudFormation that is being referenced --
hence the deployment failed.

Given that, the way to break this impasse is to remove the reference in the consuming Stack,
but preserve the exports in the producing Stack.
Since the reference being removed turns off the CDK machinery that generates the exports,
we need to create those exports explicitly ourselves.
The exports don't serve any purpose other than to make the deploy of the producing Stack succeed,
hence my name for this pattern -- "dummy exports".

If you're using CDK in version `1.90.1` or later,
there is a helper method in the `Stack` class, `exportValue`,
that allows you to easily maintain the given attribute of a resource as an export of the Stack.

If you're using a version of CDK earlier than `1.90.1`,
you need to create the dummy exports manually.
You do it using the `CfnOutput` class with the `exportName` property filled.
Both the `exportName`,
and the logical ID of the Output itself need to be exactly the same as the names the CDK generated for them.
You can use the `overrideLogicalId()` method of `CfnOutput` to make sure it has the correct name.
The simplest way to find out what those names should be is to just use any name at first,
and then run `cdk diff` --
you can then copy the auto-generated names you see in the output of that command to your code.
Keep running `cdk diff` until it shows no edits or deletions in the producing Stack -- only additions.

The code creating the "dummy exports" for our producing Stack is in the file
[src/app.ts](src/app.ts).
You can verify the names have been filled correctly with the `cdk diff` command:

```shell script
$ cd ../03-dummy-exports
$ yarn cdk diff
```

While the consuming Stack will have a bunch of edits
(at the minimum, you should see the removal of the references to the previously shared resource, the S3 Bucket),
the producing Stack should only have additions:

```
Stack ProducingStack
Resources
[+] AWS::DynamoDB::Table Table TableCD117FA1

Outputs
[+] Output Exports/Output{"Fn::GetAtt":["TableCD117FA1","Arn"]} ExportsOutputFnGetAttTableCD117FA1ArnE2C8C204: {"Value":{"Fn::GetAtt":["TableCD117FA1","Arn"]},"Export":{"Name":"ProducingStack:ExportsOutputFnGetAttTableCD117FA1ArnE2C8C204"}}
[+] Output Exports/Output{"Ref":"TableCD117FA1"} ExportsOutputRefTableCD117FA1D18A8047: {"Value":{"Ref":"TableCD117FA1"},"Export":{"Name":"ProducingStack:ExportsOutputRefTableCD117FA1D18A8047"}}
```

Output from `cdk diff` like this
(containing only additions)
signifies the code creating the `CfnOutput` instance(s)
uses the correct names -- the same as the names the CDK generated for the exports originally.

(The new Outputs are there because of the new shared resource between the two Stacks, the DynamoDB Table)

You can now deploy the application,
and it should succeed:

```shell script
$ yarn cdk deploy '*'
```

So, at this stage,
we successfully managed to change the resource shared between the Stacks from an S3 Bucket to a DynamoDB Table.
But we have these extra Outputs lying around in our code, and they're pretty ugly...
No worries though!
We will get rid of them in [part 4](../04-exports-cleanup).
