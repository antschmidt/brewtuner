import { createClient } from '@nhost/nhost-js';

const isBrowser = typeof window !== 'undefined';

export const nhost = createClient({
  authUrl: isBrowser ? 'https://auth.brewtuner.app/v1' : undefined,
  graphqlUrl: isBrowser ? 'https://graphql.brewtuner.app/v1/graphql' : undefined,
  storageUrl: isBrowser ? 'https://storage.brewtuner.app/v1' : undefined
});