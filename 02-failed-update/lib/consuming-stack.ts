import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';

export interface ConsumingStackProps extends cdk.StackProps {
  readonly table: dynamodb.ITable;
}

export class ConsumingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConsumingStackProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-code')),
      handler: 'index.handler',
      environment: {
        'TABLE_NAME': props.table.tableName,
      },
    });
    func.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DescribeTable'],
      resources: [props.table.tableArn],
    }));
  }
}
