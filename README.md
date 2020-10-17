# Unblocking cross-stack CDK references example

This example CDK project is meant to demonstrate how to unblock yourself when attempting
to remove a reference between two Stacks when using the
[Cloud Development Kit](https://github.com/aws/aws-cdk).

Often when trying to deploy a change that removes a reference between two CDK Stacks,
you run into the dreaded error:

```
Export cannot be deleted as it is in use by another Stack
```

This example project demonstrates how to solve that problem by walking through a scenario where a reference is first established,
and then subsequently modified --
initially resulting in the above error,
and finally successfully by using a trick I call "synthetic exports".

This repository uses [Yarn](https://classic.yarnpkg.com) as its package manager,
so make sure you have it installed before trying the examples.

Start by installing the required dependencies:

```shell script
$ yarn install
```

After you've done that, proceed to [part 1](01-setup) to get started!
