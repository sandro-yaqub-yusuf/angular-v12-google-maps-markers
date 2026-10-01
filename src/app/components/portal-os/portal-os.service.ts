import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AbastecimentoRaw, DadosGeo, MonitoramentoEquipeRaw, PontoControleRaw, PostoCredenciadoRaw, ResidenciaRaw, RetiradaMaterialRaw, VeiculoRaw } from './models/portal-os.model';

const MOCKS = 'assets/mocks/';

@Injectable()
export class PortalOsService {
  constructor(private http: HttpClient) { }

  carregarDados(): Observable<DadosGeo> {
    return forkJoin(
      this.http.get<AbastecimentoRaw[]>(`${MOCKS}abastecimentos.json`),
      this.http.get<MonitoramentoEquipeRaw[]>(`${MOCKS}monitoramento-equipes.json`),
      this.http.get<PontoControleRaw[]>(`${MOCKS}pontos-controle.json`),
      this.http.get<PostoCredenciadoRaw[]>(`${MOCKS}postos-credenciados.json`),
      this.http.get<ResidenciaRaw[]>(`${MOCKS}residencias.json`),
      this.http.get<RetiradaMaterialRaw[]>(`${MOCKS}retiradas-materiais.json`),
      this.http.get<VeiculoRaw[]>(`${MOCKS}veiculos.json`)
    ).pipe(
      map(([abastecimentos, monitoramentosEquipes, pontosControles, postosCredenciados, residencias, retiradasMateriais, veiculos]) => ({
        abastecimentos: (abastecimentos ?? []),
        monitoramentosEquipes: (monitoramentosEquipes ?? []),
        pontosControles: (pontosControles ?? []),
        postosCredenciados: (postosCredenciados ?? []),
        residencias: (residencias ?? []),
        retiradasMateriais: (retiradasMateriais ?? []),
        veiculos: (veiculos ?? [])
      })),
      delay(this.atrasoSimulado())
    );
  }

  private atrasoSimulado(): number {
    const min = environment.mockDelayMin;
    const max = environment.mockDelayMax;

    return Math.round(min + Math.random() * (max - min));
  }
}
