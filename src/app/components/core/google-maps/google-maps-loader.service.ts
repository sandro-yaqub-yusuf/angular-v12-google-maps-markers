import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class GoogleMapsLoaderService {
  readonly possuiChave = !!environment.mapsApiKey;
  readonly apiLoaded$: Observable<boolean>;

  constructor(http: HttpClient) {
    const jaCarregada = (typeof google !== 'undefined' && !!google?.maps);

    const origem$ = (!this.possuiChave
      ? of(false)
      : jaCarregada
        ? of(true)
        : http.jsonp(`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(environment.mapsApiKey)}`, 'callback').pipe(
          map(() => true),
          catchError((erro) => {
            console.error('[GoogleMapsLoader] Falha ao carregar a API do Google Maps:', erro);

            return of(false);
          })
        ));

    this.apiLoaded$ = origem$.pipe(shareReplay(1));
  }
}
