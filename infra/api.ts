import { loadConfig } from './config';
import { personTable } from './database';
import { personCreatedBus } from './eventbridge';

const api = new sst.aws.ApiGatewayV2('PersonApi', {
  domain: {
    name: 'api.marcelosavian.com',
    path: 'v1',
    cert: 'arn:aws:acm:eu-west-3:435238036861:certificate/0232bec4-430e-473d-95ca-c7f688305a1e',
  },
  link: [personTable, personCreatedBus],
});

api.route('POST /person', {
  handler: 'packages/functions/src/routes/v1-person-api.handler',
});

export { api };
