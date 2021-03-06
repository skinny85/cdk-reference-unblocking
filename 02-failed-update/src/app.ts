#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';

class ProducingStack extends cdk.Stack {
  public readonly table: dynamodb.ITable;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'Name',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

interface ConsumingStackProps extends cdk.StackProps {
  readonly table: dynamodb.ITable;
}

class ConsumingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConsumingStackProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-code')),
      handler: 'index.handler',
      environment: {
        // pass the name of the Table into the function as an environment variable
        'TABLE_NAME': props.table.tableName,
      },
    });
    // allow the function to call DescribeTable on the passed Table
    func.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DescribeTable'],
      resources: [props.table.tableArn],
    }));
  }
}

const app = new cdk.App();
const producingStack = new ProducingStack(app, 'ProducingStack');
new ConsumingStack(app, 'ConsumingStack', {
  table: producingStack.table,
});
