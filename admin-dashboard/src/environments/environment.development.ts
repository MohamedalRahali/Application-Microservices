/**
 * Dev local : appels directs vers la gateway.
 * (Le proxy Vite d’Angular 18+ ne transmet pas les POST sur `/api` — le serveur
 * répond « Cannot POST /api/... ». Les GET passent ; POST/PATCH/PUT non.)
 * La gateway autorise déjà CORS pour localhost:4200 et :4201.
 */
export const environment = {
  production: false,
  apiOrigin: 'http://localhost:8080',
  /** Local sans Keycloak : pas d’appel à :9090 (évite erreurs réseau / console). */
  keycloakEnabled: false,
};
