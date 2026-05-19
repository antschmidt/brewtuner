// filepath: src/lib/addressFields.ts

/**
 * Maps country codes/names to the address form fields they typically require.
 * Extend or customize as needed.
 */

/**
 * List of address field groups by country. Each entry specifies which countries use the same set of fields.
 */
export const addressFieldGroups: Array<{ countries: string[]; fields: string[] }> = [
  {
    countries: ["USA"],
    fields: ["address1", "address2", "city", "state", "zip"]
  },
  {
    countries: ["Canada"],
    fields: ["address1", "address2", "city", "province", "postalCode"]
  },
  {
    countries: ["UK"],
    fields: ["address1", "address2", "city", "county", "postcode"]
  },
  {
    countries: ["Australia"],
    fields: ["address1", "address2", "suburb", "state", "postcode"]
  },
  {
    countries: ["Germany", "France", "Poland", "Croatia", "Portugal", "Spain", "Norway", "Sweden"],
    fields: ["address1", "address2", "postalCode", "city"]
  },
  {
    countries: ["Kenya"],
    fields: ["address1", "address2", "city", "county", "postalCode"]
  },
  {
    countries: ["Tanzania", "Namibia"],
    fields: ["address1", "address2", "city", "region", "postalCode"]
  },
  {
    countries: ["Japan"],
    fields: ["address1", "address2", "city", "prefecture", "postalCode"]
  },
  {
    countries: ["Brazil", "Mexico"],
    fields: ["address1", "address2", "city", "state", "postalCode"]
  },
  {
    countries: ["Argentina"],
    fields: ["address1", "address2", "city", "province", "postalCode"]
  },
  {
    countries: ["Default"],
    fields: ["address1", "address2", "city", "region", "postalCode", "country"]
  }
];
