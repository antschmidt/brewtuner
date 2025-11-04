/**
 * Nhost Client Configuration
 *
 * Initializes the Nhost client with authentication, GraphQL, and storage URLs.
 * Configured for use in both browser and SSR environments.
 */

import { NhostClient } from '@nhost/nhost-js';
import { PUBLIC_NHOST_SUBDOMAIN, PUBLIC_NHOST_REGION } from '$env/static/public';

const isBrowser = typeof window !== 'undefined';

/** Configured Nhost client instance for authentication and data operations */
export const nhost = new NhostClient({
  subdomain: PUBLIC_NHOST_SUBDOMAIN,
  region: PUBLIC_NHOST_REGION,
  clientStorage: isBrowser ? localStorage : undefined,
  clientStorageType: 'web',
  autoLogin: true,
  authUrl: isBrowser ? 'https://auth.brewtuner.app/v1' : undefined,
  graphqlUrl: isBrowser ? 'https://graphql.brewtuner.app/v1/graphql' : undefined,
  storageUrl: isBrowser ? 'https://storage.brewtuner.app/v1' : undefined
});