import zod from 'zod';

const Env = zod.enum(['test', 'prod']);
type Env = zod.infer<typeof Env>;

export const AppConfig = zod.object({
  domain: zod.string(),
  certificateArn: zod.string(),
});
export type AppConfig = zod.infer<typeof AppConfig>;

export const loadConfig = (): AppConfig => {
  const env = Env.catch('test').parse($app.stage);

  const domain =
    $app.stage == env
      ? `api.${env}.marcelosavian.com`
      : `${$app.stage}.api.${env}.marcelosavian.com`;

  const config: Record<Env, AppConfig> = {
    test: {
      domain,
      certificateArn:
        'arn:aws:acm:eu-west-3:435238036861:certificate/b00857c0-9555-43a8-a86b-6dbe743e4bf1',
    },
    prod: {
      domain,
      certificateArn: 'to-be-created',
    },
  };

  return config[env];
};
