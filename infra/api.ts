import { loadConfig } from './config';
import { personTable } from './database';
import { personCreatedBus } from './eventbridge';

const config = loadConfig();

const api = new sst.aws.ApiGatewayV2('PersonApi', {
  domain: {
    name: config.domain,
    path: 'v1',
    cert: config.certificateArn,
  },
  link: [personTable, personCreatedBus],
});

api.route('POST /person', {
  handler: 'packages/functions/src/routes/v1-person-api.handler',
});

export { api };
