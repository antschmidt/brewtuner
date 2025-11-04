import { createClient } from '@nhost/nhost-js';
import { PUBLIC_NHOST_SUBDOMAIN, PUBLIC_NHOST_REGION } from '$env/static/public';

export const nhost = createClient({
  subdomain: PUBLIC_NHOST_SUBDOMAIN,
  region: PUBLIC_NHOST_REGION
});