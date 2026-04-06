/** Build production (défaut). En dev : `environment.development.ts` via fileReplacements. */
export const environment = {
  production: true,
  apiOrigin: 'http://localhost:8080',
  /** false = admin sans SSO (déploiement interne). */
  keycloakEnabled: true,
};
