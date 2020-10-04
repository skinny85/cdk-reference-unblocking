#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ProducingStack } from '../lib/producing-stack';
import { ConsumingStack } from '../lib/consuming-stack';

const app = new cdk.App();
const producingStack = new ProducingStack(app, 'ProducingStack');
new ConsumingStack(app, 'ConsumingStack', {
  bucket: producingStack.bucket,
});
