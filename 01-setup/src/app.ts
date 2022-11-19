#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as path from 'path';

class ProducingStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

interface ConsumingStackProps extends cdk.StackProps {
  readonly bucket: s3.IBucket;
}

class ConsumingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ConsumingStackProps) {
    super(scope, id, props);

    const func = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-code')),
      handler: 'index.handler',
      environment: {
        // pass the name of the Bucket into the function as an environment variable
        'BUCKET_NAME': props.bucket.bucketName,
      },
    });
    // allow the function to call GetBucketAcl on the passed Bucket
    props.bucket.grantRead(func);
  }
}

class MyStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
      super(scope, id, props);

      const producingStack = new ProducingStack(this, 'ProducingStack');
      new ConsumingStack(this, 'ConsumingStack', {
          bucket: producingStack.bucket,
      });
  }
}

const app = new cdk.App();

// test Stage
new MyStage(app, 'MyTestStage', {
  env: {
    account: 'test-account',
    region: 'test-region',
  },
});

// prod Stage
new MyStage(app, 'MyProdStage', {
  env: {
    account: 'prod-account',
    region: 'prod-region',
  },
});

// developer Stage
new MyStage(app, 'MyDevStage');
