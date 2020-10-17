#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
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

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    /*
     * Create the "synthetic exports" to make the producing Stack deploy correctly.
     * Note that we need 2 of them,
     * as there were 2 different references to the Bucket in the previous consuming Stack version
     * (one to the name in the Lambda's environment variables,
     * and one to the ARN by way of the grantReadWrite() call).
     */
    const bucketNameOutput = new cdk.CfnOutput(this, 'BucketNameOutput', {
      value: bucket.bucketName,
      exportName: 'ProducingStack:ExportsOutputRefBucket83908E7781C90AC0',
    });
    bucketNameOutput.overrideLogicalId('ExportsOutputRefBucket83908E7781C90AC0');
    const bucketArnOutput = new cdk.CfnOutput(this, 'BucketArnOutput', {
      value: bucket.bucketArn,
      exportName: 'ProducingStack:ExportsOutputFnGetAttBucket83908E77Arn063C8555',
    });
    bucketArnOutput.overrideLogicalId('ExportsOutputFnGetAttBucket83908E77Arn063C8555');
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
