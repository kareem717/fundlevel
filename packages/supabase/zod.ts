// Explicitly export all schemas from the src directory
import * as schemas from "./src/zod";
export * from "./src/zod";

// Explicitly re-export the specific schema that's causing trouble
export const publicAccountsInsertSchemaSchema =
  schemas.publicAccountsInsertSchemaSchema;
export const publicAccountsRowSchemaSchema =
  schemas.publicAccountsRowSchemaSchema;
export const publicCompaniesInsertSchemaSchema =
  schemas.publicCompaniesInsertSchemaSchema;
export const publicCompaniesRowSchemaSchema =
  schemas.publicCompaniesRowSchemaSchema;
export const publicPlaidCredentialsInsertSchemaSchema =
  schemas.publicPlaidCredentialsInsertSchemaSchema;
export const publicPlaidCredentialsRowSchemaSchema =
  schemas.publicPlaidCredentialsRowSchemaSchema;
