#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkTipsPart3ExampleProjectStack } from '../lib/cdk-tips-part-3-example-project-stack';

const app = new cdk.App();
new CdkTipsPart3ExampleProjectStack(app, 'CdkTipsPart3ExampleProjectStack');
