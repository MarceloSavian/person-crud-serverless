import { Resource } from 'sst';
import zod from 'zod';

const Env = zod.enum(['test', 'prod']);
type Env = zod.infer<typeof Env>;

export const AppConfig = zod.object({
  domain: zod.string(),
  certificateArn: zod.string(),
});
export type AppConfig = zod.infer<typeof AppConfig>;

export const loadConfig = (): AppConfig => {
  const env = Env.catch('test').parse(Resource.App.stage);

  const domain =
    Resource.App.stage == env
      ? `api.${env}.marcelosavian.com`
      : `api.${env}.${Resource.App.stage}.marcelosavian.com`;

  const config: Record<Env, AppConfig> = {
    test: {
      domain,
      certificateArn:
        'arn:aws:acm:eu-west-3:435238036861:certificate/0232bec4-430e-473d-95ca-c7f688305a1e',
    },
    prod: {
      domain,
      certificateArn: 'to-be-created',
    },
  };

  return config[env];
};
