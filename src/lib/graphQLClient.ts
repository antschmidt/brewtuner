import { nhost } from './nhostClient';

// Define and export core entity types
export interface Roaster {
  id: string;
  name: string;
}
export interface Bean {
  id: string;
  name: string;
}
export interface Grinder {
  id: string;
  name: string;
}
export interface BrewMethod {
  id: string;
  name: string;
}

// represent a grinder profile including new fields
export interface Profile {
  id: string;
  profile_setting: number;
  grams: number;
  tamped: boolean;
  adjustment: string;
}

// represent a single grind log entry
export interface GrindLog {
  id: string;
  setting: number;
  outcome: string;
  adjustment: string;
  grams: number;
  tamped: boolean;
  created_at: string;
}

// log a grinder-specific log entry
export interface GrinderLog {
  id: string;
  created_at: string;
}

// fetch all roasters
export async function getRoasters() {
    const query = `
    query {
      roasters {
        id
        name
      }
    }
  `;
    const result = await nhost.graphql.request<{
        roasters: { id: string; name: string }[]
    }>(query); console.log("Roasters fetched:", result);
    // now result.data.roasters contains your array
    const roasters = result.data.roasters;
    return roasters;
}

// fetch beans by roaster
export async function getBeans(roasterId: string) {
    const query = `
    query ($roaster_id: uuid!) {
      beans(where: {roaster_id: {_eq: $roaster_id}}) {
        id
        name
      }
    }
  `;
    const variables = { roaster_id: roasterId };
    const response = await nhost.graphql.request<{
        beans: { id: string; name: string }[]
    }>(query, variables);
    console.log("Beans fetched:", response);
    const beans = response.data.beans;
    return beans;
}

// fetch all grinders
export async function getGrinders() {
  const query = `
    query {
      grinders {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ grinders: { id: string; name: string }[] }>(query);
  return response.data.grinders;
}

// fetch all brew methods
export async function getBrewMethods() {
  const query = `
    query {
      brew_methods {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ brew_methods: { id: string; name: string }[] }>(query);
  return response.data.brew_methods;
}

// fetch or insert a profile
export async function upsertProfile(
  beanId: string,
  grinderId: string,
  brewMethodId: string,
  profile_setting: number,
  grams: number,
  tamped: boolean = false
): Promise<Profile> {
  const mutation = `
    mutation ($bean_id: uuid!, $grinder_id: uuid!, $brew_method_id: uuid!, $profile_setting: numeric!, $grams: numeric!, $tamped: Boolean!) {
      insert_profiles_one(
        object: {
          bean_id: $bean_id,
          grinder_id: $grinder_id,
          brew_method_id: $brew_method_id,
          profile_setting: $profile_setting,
          grams: $grams,
          tamped: $tamped
        },
        on_conflict: {
          constraint: profiles_bean_id_grinder_id_brew_method_id_key,
          update_columns: [profile_setting, grams, tamped]
        }
      ) {
        id
        profile_setting
        grams
        tamped
      }
    }
  `;
  const vars = { bean_id: beanId, grinder_id: grinderId, brew_method_id: brewMethodId, profile_setting, grams, tamped };
  const response = await nhost.graphql.request<{ insert_profiles_one: Profile }>(mutation, vars);
  return response.data.insert_profiles_one;
}

// log a grind attempt
export async function logGrind(profileId: string, setting: number, outcome: string, adjustment: 'coarser' | 'finer' | 'good', tamped: boolean = false, grams: number) {
    const mutation = `
    mutation ($profile_id: uuid!, $setting: numeric!, $outcome: String!, $adjustment: String!, $tamped: Boolean!, $grams: numeric!) {
      insert_grind_logs_one(
        object: {
          profile_id: $profile_id,
          setting: $setting,
          outcome: $outcome,
          adjustment: $adjustment,
          tamped: $tamped,
          grams: $grams
        }
      ) {
        id
        created_at
      }
    }
  `;
    const vars = { profile_id: profileId, setting, outcome, adjustment, tamped, grams };
    const response = await nhost.graphql.request<{ insert_grind_logs_one: { id: string; created_at: string } }>(mutation, vars);
    return response.data.insert_grind_logs_one;
}

// log a grinder-specific log entry
export async function logGrinderLog(
  grinderId: string,
  setting: number,
  outcome: string,
  adjustment: 'coarser' | 'finer' | 'good',
  tamped: boolean = false,
  grams: number
): Promise<GrinderLog> {
  const mutation = `
    mutation ($grinder_id: uuid!, $setting: numeric!, $outcome: String!, $adjustment: String!, $tamped: Boolean!, $grams: numeric!) {
      insert_grinder_logs_one(
        object: {
          grinder_id: $grinder_id,
          setting: $setting,
          outcome: $outcome,
          adjustment: $adjustment,
          tamped: $tamped,
          grams: $grams
        }
      ) {
        id
        created_at
      }
    }
  `;
  const vars = { grinder_id: grinderId, setting, outcome, adjustment, tamped, grams };
  const response = await nhost.graphql.request<{ insert_grinder_logs_one: GrinderLog }>(mutation, vars);
  return response.data.insert_grinder_logs_one;
}

// insert a new bean under a roaster
export async function addBean(roasterId: string, name: string) {
  const mutation = `
    mutation ($roaster_id: uuid!, $name: String!) {
      insert_beans_one(
        object: { roaster_id: $roaster_id, name: $name }
      ) {
        id
        name
      }
    }
  `;
    const variables = { roaster_id: roasterId, name };
    const response = await nhost.graphql.request<{ insert_beans_one: { id: string; name: string } }>(mutation, variables);
    return response.data.insert_beans_one;
}

// add a new grinder
export async function addGrinder(name: string) {
  const mutation = `
    mutation ($name: String!) {
      insert_grinders_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_grinders_one: { id: string; name: string } }>(mutation, { name });
  return response.data.insert_grinders_one;
}

// add a new brew method
export async function addBrewMethod(name: string) {
  const mutation = `
    mutation ($name: String!) {
      insert_brew_methods_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_brew_methods_one: { id: string; name: string } }>(mutation, { name });
  return response.data.insert_brew_methods_one;
}

// insert a new roaster
export async function addRoaster(name: string) {
console.log("Adding roaster:", name);
  const mutation = `
    mutation ($name: String!) {
      insert_roasters_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_roasters_one: { id: string; name: string } }>(mutation, { name });
  return response.data.insert_roasters_one;
}

export async function updateGrinderLog(
  logId: string,
  updates: {
    setting?: number;
    outcome?: string;
    adjustment?: 'coarser' | 'finer' | 'good';
    tamped?: boolean;
    grams?: number;
  }
): Promise<GrindLog> {
  const mutation = `
    mutation UpdateGrinderLog(
      $id: uuid!,
      $setting: numeric,
      $outcome: String,
      $adjustment: String,
      $tamped: Boolean,
      $grams: numeric
    ) {
      update_grind_logs_by_pk(
        pk_columns: { id: $id },
        _set: {
          setting: $setting,
          outcome: $outcome,
          adjustment: $adjustment,
          tamped: $tamped,
          grams: $grams
        }
      ) {
        id
        setting
        outcome
        adjustment
        tamped
        grams
        created_at
        profile_id # Assuming you might need this or other fields
      }
    }
  `;
  const variables = { id: logId, ...updates };
  
  // Filter out undefined properties from updates, so they are not sent in _set
  // Hasura typically ignores undefined fields in _set, but explicit is often better.
  for (const key in variables) {
    if (variables[key] === undefined) {
      delete variables[key];
    }
  }
  // Ensure 'id' is always present
  variables.id = logId;


  const response = await nhost.graphql.request<{ update_grind_logs_by_pk: GrindLog }>(
    mutation,
    variables
  );

  if (response.error || !response.data?.update_grind_logs_by_pk) {
    console.error("Error updating grinder log:", response.error);
    throw response.error || new Error("Failed to update grinder log or no data returned.");
  }
  return response.data.update_grind_logs_by_pk;
}

// fetch existing profile by bean, grinder, and brew method
export async function getProfile(
  beanId: string,
  grinderId: string,
  brewMethodId: string
): Promise<Profile | null> {
  const query = `
  query ($bean_id: uuid!, $grinder_id: uuid!, $brew_method_id: uuid!) {
    profiles(
      where: {
        bean_id: { _eq: $bean_id },
        grinder_id: { _eq: $grinder_id },
        brew_method_id: { _eq: $brew_method_id }
      }
    ) {
      id
      profile_setting
      grams
      tamped
    }
  }
`;
  const vars = { bean_id: beanId, grinder_id: grinderId, brew_method_id: brewMethodId };
  try {
    const response = await nhost.graphql.request<{ profiles: Profile[] }>(query, vars);
    return response.data.profiles[0] || null;
  } catch (err) {
    console.error('Error fetching profile', err);
    return null;
  }
}

// fetch all grind logs for a given profile, most recent first
export async function getGrindLogs(profileId: string): Promise<GrindLog[]> {
  const query = `
    query ($profile_id: uuid!) {
      grind_logs(
        where: { profile_id: { _eq: $profile_id } },
        order_by: { created_at: desc }
      ) {
        id
        setting
        outcome
        adjustment
        grams
        created_at
        tamped
      }
    }
  `;
  const vars = { profile_id: profileId };
  const response = await nhost.graphql.request<{ grind_logs: GrindLog[] }>(query, vars);
  return response.data.grind_logs;
}