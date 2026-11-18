export type EnvironmentMode = 'production' | 'preview' | 'staging' | 'development' | 'test';
export type GastronomyAuthMode = 'basic' | 'supabase';
export interface Target {
  environment: EnvironmentMode;
  url: string;
  ref: string;
}

export const PRODUCTION_REFS: readonly string[];
export const STAGING_REFS: readonly string[];
export const ENVIRONMENTS: readonly EnvironmentMode[];
export const PRODUCTION_BROWSER_HOSTS: readonly string[];

export function decodeJwtPayload(token: unknown): Record<string, unknown> | null;
export function hasValidCloudAdminJwtClaims(
  token: string,
  expectedIssuerOrigin: string,
  requireJwt: boolean
): boolean;
export function environment(env: Record<string, string | undefined>): EnvironmentMode;
export function target(raw: string | null | undefined, mode: EnvironmentMode): Target;
export function publicKey(key: string | null | undefined): string;
export function serviceRoleKey(
  key: string | null | undefined,
  expectedRef: string,
  mode: EnvironmentMode
): string;
export function configuration(env: Record<string, string | undefined>): Target;
export function authMode(env: Record<string, string | undefined>): GastronomyAuthMode;
