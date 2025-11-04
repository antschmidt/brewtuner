/**
 * GraphQL Client for BrewTuner
 *
 * This module provides GraphQL queries and mutations for interacting with the Nhost backend.
 * It handles all data operations for roasters, beans, grinders, brew methods, profiles, and grind logs.
 */

import { nhost } from './nhostClient';

// ============================================================================
// Type Definitions
// ============================================================================

/** Represents a coffee roaster/company */
export interface Roaster {
  id: string;
  name: string;
}

/** Represents a specific coffee bean from a roaster */
export interface Bean {
  id: string;
  name: string;
}

/** Represents a coffee grinder */
export interface Grinder {
  id: string;
  name: string;
}

/** Represents a coffee brewing method (e.g., espresso, pour over) */
export interface BrewMethod {
  id: string;
  name: string;
}

/**
 * Represents a saved grind profile for a specific combination of
 * bean, grinder, and brew method
 */
export interface Profile {
  id: string;
  profile_setting: number;
  grams: number;
  tamped: boolean;
  adjustment: string;
}

/** Represents a single grind log entry with all parameters */
export interface GrindLog {
  id: string;
  setting: number;
  outcome: string;
  adjustment: string;
  grams: number;
  tamped: boolean;
  created_at: string;
}

/** Represents a grinder-specific log entry */
export interface GrinderLog {
  id: string;
  created_at: string;
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Fetches all coffee roasters from the database
 * @returns Promise resolving to array of roasters
 * @throws Error if the GraphQL request fails
 */
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
    }>({
        query,
    });
    console.log("Roasters fetched:", result);
    // now result.body.data.roasters contains your array
    const roasters = result.body.data!.roasters;
    return roasters;
}

/**
 * Fetches all beans for a specific roaster
 * @param roasterId - UUID of the roaster
 * @returns Promise resolving to array of beans for the given roaster
 * @throws Error if the GraphQL request fails
 */
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
    }>({
        query,
        variables
    });
    console.log("Beans fetched:", response);
    const beans = response.body.data!.beans;
    return beans;
}

/**
 * Fetches all grinders from the database
 * @returns Promise resolving to array of grinders
 * @throws Error if the GraphQL request fails
 */
export async function getGrinders() {
  const query = `
    query {
      grinders {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ grinders: { id: string; name: string }[] }>({ query });
  return response.body.data!.grinders;
}

/**
 * Fetches all brew methods from the database
 * @returns Promise resolving to array of brew methods
 * @throws Error if the GraphQL request fails
 */
export async function getBrewMethods() {
  const query = `
    query {
      brew_methods {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ brew_methods: { id: string; name: string }[] }>({ query });
  return response.body.data!.brew_methods;
}

// ============================================================================
// Mutation Functions - Profiles
// ============================================================================

/**
 * Creates or updates a grind profile
 * Uses upsert to either insert a new profile or update existing one based on
 * the unique combination of bean, grinder, and brew method
 * @param beanId - UUID of the bean
 * @param grinderId - UUID of the grinder
 * @param brewMethodId - UUID of the brew method
 * @param profile_setting - Grinder setting value
 * @param grams - Coffee weight in grams
 * @param tamped - Whether the coffee was tamped
 * @returns Promise resolving to the created/updated profile
 * @throws Error if the GraphQL request fails
 */
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
  const response = await nhost.graphql.request<{ insert_profiles_one: Profile }>({ query: mutation, variables: vars });
  return response.body.data!.insert_profiles_one;
}

// ============================================================================
// Mutation Functions - Grind Logs
// ============================================================================

/**
 * Logs a single grind attempt for a profile
 * @param profileId - UUID of the profile
 * @param setting - Grinder setting value
 * @param outcome - Description of the outcome/notes
 * @param adjustment - Assessment of whether to adjust coarser, finer, or keep the same
 * @param tamped - Whether the coffee was tamped
 * @param grams - Coffee weight in grams
 * @returns Promise resolving to the created log entry with id and timestamp
 * @throws Error if the GraphQL request fails
 */
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
    const response = await nhost.graphql.request<{ insert_grind_logs_one: { id: string; created_at: string } }>({ query: mutation, variables: vars });
    return response.body.data!.insert_grind_logs_one;
}

/**
 * Logs a grinder-specific entry (separate from profile-based logs)
 * @param grinderId - UUID of the grinder
 * @param setting - Grinder setting value
 * @param outcome - Description of the outcome/notes
 * @param adjustment - Assessment of whether to adjust coarser, finer, or keep the same
 * @param tamped - Whether the coffee was tamped
 * @param grams - Coffee weight in grams
 * @returns Promise resolving to the created grinder log entry
 * @throws Error if the GraphQL request fails
 */
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
  const response = await nhost.graphql.request<{ insert_grinder_logs_one: GrinderLog }>({ query: mutation, variables: vars });
  return response.body.data!.insert_grinder_logs_one;
}

// ============================================================================
// Mutation Functions - Create New Entities
// ============================================================================

/**
 * Creates a new bean under a specific roaster
 * @param roasterId - UUID of the parent roaster
 * @param name - Name of the new bean
 * @returns Promise resolving to the created bean
 * @throws Error if the GraphQL request fails
 */
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
    const response = await nhost.graphql.request<{ insert_beans_one: { id: string; name: string } }>({ query: mutation, variables });
    return response.body.data!.insert_beans_one;
}

/**
 * Creates a new grinder
 * @param name - Name of the new grinder
 * @returns Promise resolving to the created grinder
 * @throws Error if the GraphQL request fails or no data is returned
 */
export async function addGrinder(name: string) {
  const mutation = `
    mutation ($name: String!) {
      insert_grinders_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_grinders_one: { id: string; name: string } }>({ query: mutation, variables: { name } });
  if (!response.body.data) {
    throw new Error("No data returned for addGrinder");
  }
  return response.body.data!.insert_grinders_one;
}

/**
 * Creates a new brew method
 * @param name - Name of the new brew method
 * @returns Promise resolving to the created brew method
 * @throws Error if the GraphQL request fails or no data is returned
 */
export async function addBrewMethod(name: string) {
  const mutation = `
    mutation ($name: String!) {
      insert_brew_methods_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_brew_methods_one: { id: string; name: string } }>({ query: mutation, variables: { name } });
  if (!response.body.data) {
    throw new Error("No data returned for addBrewMethod");
  }
  return response.body.data!.insert_brew_methods_one;
}

/**
 * Creates a new roaster
 * @param name - Name of the new roaster
 * @returns Promise resolving to the created roaster
 * @throws Error if the GraphQL request fails
 */
export async function addRoaster(name: string) {
  const mutation = `
    mutation ($name: String!) {
      insert_roasters_one(object: { name: $name }) {
        id
        name
      }
    }
  `;
  const response = await nhost.graphql.request<{ insert_roasters_one: { id: string; name: string } }>({ query: mutation, variables: { name } });
  return response.body.data!.insert_roasters_one;
}

/**
 * Updates an existing grind log entry
 * Only the provided fields will be updated; undefined fields are ignored
 * @param logId - UUID of the log to update
 * @param updates - Object containing fields to update (partial update supported)
 * @returns Promise resolving to the updated grind log
 * @throws Error if the GraphQL request fails or log is not found
 */
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
  for (const key of Object.keys(variables) as Array<keyof typeof variables>) {
    if (variables[key] === undefined) {
      delete variables[key];
    }
  }
  // Ensure 'id' is always present
  variables.id = logId;


  const response = await nhost.graphql.request<{ update_grind_logs_by_pk: GrindLog }>({
    query: mutation,
    variables
  });

  if (!response.body.data?.update_grind_logs_by_pk) {
    console.error("Error updating grinder log");
    throw new Error("Failed to update grinder log or no data returned.");
  }
  return response.body.data!.update_grind_logs_by_pk;
}

/**
 * Fetches an existing profile by its unique combination of bean, grinder, and brew method
 * @param beanId - UUID of the bean
 * @param grinderId - UUID of the grinder
 * @param brewMethodId - UUID of the brew method
 * @returns Promise resolving to the profile if found, or null if no profile exists
 */
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
    const response = await nhost.graphql.request<{ profiles: Profile[] }>({ query, variables: vars });
    return response.body.data?.profiles[0] || null;
  } catch (err) {
    console.error('Error fetching profile', err);
    return null;
  }
}

/**
 * Fetches all grind logs for a specific profile, ordered by most recent first
 * @param profileId - UUID of the profile
 * @returns Promise resolving to array of grind logs
 * @throws Error if the GraphQL request fails or no data is returned
 */
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
  const response = await nhost.graphql.request<{ grind_logs: GrindLog[] }>({ query, variables: vars });
  if (!response.body.data) {
    throw new Error("No data returned for grind logs");
  }
  return response.body.data!.grind_logs;
}

/**
 * Deletes a grind log entry
 * @param logId - UUID of the log to delete
 * @returns Promise resolving to the ID of the deleted log
 * @throws Error if the GraphQL request fails
 */
export async function deleteGrindLog(logId: string): Promise<string> {
  const mutation = `
    mutation ($id: uuid!) {
      delete_grind_logs_by_pk(id: $id) {
        id
      }
    }
  `;
  const vars = { id: logId };
  const response = await nhost.graphql.request<{ delete_grind_logs_by_pk: { id: string } }>({ query: mutation, variables: vars });
  return response.body.data!.delete_grind_logs_by_pk.id;
}