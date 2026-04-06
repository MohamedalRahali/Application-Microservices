import { environment } from '../../environments/environment';

/** Préfixe d’origine sans slash final, ou chaîne vide pour chemins relatifs (/api/…). */
function originPrefix(): string {
  return (environment.apiOrigin ?? '').replace(/\/$/, '');
}

/** Ex. `apiUrl('/api/deliveries')` → `/api/deliveries` (dev) ou `http://localhost:8080/api/deliveries` (prod). */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const o = originPrefix();
  return o ? `${o}${p}` : p;
}
