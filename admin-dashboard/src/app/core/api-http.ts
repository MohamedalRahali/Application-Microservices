import { HttpHeaders, HttpParams } from '@angular/common/http';

/** Même stratégie pour tous les modules admin : éviter cache navigateur et réponses obsolètes. */
export function apiJsonHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
}

export function apiCacheBustParams(): HttpParams {
  return new HttpParams().set('_t', String(Date.now()));
}
