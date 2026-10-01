import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GoogleMapsLoaderService } from '../core/google-maps/google-maps-loader.service';
import { AbastecimentoRaw, AparelhoMobile, DadosGeo, Detalhe, MarkerItem, MonitoramentoEquipeRaw, PontoControleRaw, PostoCredenciadoRaw, ResidenciaRaw, RetiradaMaterialRaw, TrajetoMobile, VeiculoRaw } from './models/portal-os.model';
import { PortalOsMarker } from './portal-os.marker';
import { PortalOsService } from './portal-os.service';

@Component({
  selector: 'app-portal-os',
  templateUrl: './portal-os.component.html',
  styleUrls: ['./portal-os.component.css']
})
export class PortalOsComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap) set mapaRef(mapa: (GoogleMap | undefined)) {
    this.mapa = mapa;

    this.tentarEnquadrar();
  }
  @ViewChild(MapInfoWindow) private infoWindow?: MapInfoWindow;
  @ViewChildren(MapMarker) private markerElements?: QueryList<MapMarker>;

  readonly apiLoaded$: Observable<boolean>;
  readonly possuiChave: boolean;
  readonly zoom = 15;
  readonly options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  };
  public polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#5c7288',
    strokeOpacity: 0.7,
    strokeWeight: 5,
    geodesic: true
  };

  public carregando = true;
  public detalheVisivel = false;
  public navigationText = '';
  public temErro = false;

  public center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  public markersVisiveis: MarkerItem[] = [];
  public markerSelecionadoTimeline?: number;
  public infoContent = '';

  public aparelhosMobile: AparelhoMobile[] = [];
  public detalhe: Detalhe[] = [];
  public trajetos: TrajetoMobile[] = [];

  public abastecimento = true;
  public monitoramentoEquipe = true;
  public pontoControle = true;
  public postoCredenciado = true;
  public residenciaTecnico = true;
  public retiradaMaterial = true;
  public veiculo = true;

  public qtdeDadosAbastecimento = 0;
  public qtdeDadosMonitoramentoEquipe = 0;
  public qtdeDadosPontoControle = 0;
  public qtdeDadosPostoCredenciado = 0;
  public qtdeDadosRetiradaMaterial = 0;
  public qtdeDadosVeiculo = 0;

  public dadosDoDetalhe: { Titulo: string; Cabecalho: string[]; Itens: string[][] } = {
    Titulo: '',
    Cabecalho: [],
    Itens: []
  };

  private readonly builder = new PortalOsMarker();
  private readonly destroy$ = new Subject<void>();

  private mapa?: GoogleMap;
  private enquadrarPendente = false;

  private detalheAbastecimento: Detalhe[] = [];
  private detalhePontoControle: Detalhe[] = [];
  private detalheRetiradaMaterial: Detalhe[] = [];
  private detalheResidencia: Detalhe[] = [];
  private detalheVeiculo: Detalhe[] = [];

  private listaAbastecimento: MarkerItem[] = [];
  private listaPontoControle: MarkerItem[] = [];
  private listaPostoCredenciado: MarkerItem[] = [];
  private listaRetiradaMaterial: MarkerItem[] = [];
  private listaResidencia: MarkerItem[] = [];
  private listaVeiculo: MarkerItem[] = [];

  private retAbastecimento: AbastecimentoRaw[] = [];
  private retMonitoramentoEquipe: MonitoramentoEquipeRaw[] = [];
  private retPontoControle: PontoControleRaw[] = [];
  private retPostoCredenciado: PostoCredenciadoRaw[] = [];
  private retResidencia: ResidenciaRaw[] = [];
  private retRetiradaMaterial: RetiradaMaterialRaw[] = [];
  private retVeiculo: VeiculoRaw[] = [];

  constructor(gmLoader: GoogleMapsLoaderService,
    private localeService: BsLocaleService,
    private portalOsService: PortalOsService,
    private toastr: ToastrService
  ) {
    this.apiLoaded$ = gmLoader.apiLoaded$;
    this.possuiChave = gmLoader.possuiChave;

    if (!this.possuiChave) this.temErro = true;

    this.localeService.use('pt-br');
  }

  get possuiDados(): boolean {
    return (this.retAbastecimento.length + this.retMonitoramentoEquipe.length + this.retPontoControle.length +
      this.retPostoCredenciado.length + this.retResidencia.length + this.retRetiradaMaterial.length + this.retVeiculo.length) > 0;
  }

  ngOnInit(): void {
    this.navigationText = 'Dados Diário por Técnico - Administrativo';

    this.apiLoaded$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(carregada => {
        if (carregada) {
          this.chamarApiGEO();

          return;
        }

        this.carregando = false;
        this.temErro = true;

        this.toastr.error((this.possuiChave ? 'Não foi possível carregar o Google Maps.' : 'Chave da API do Google Maps não configurada.'), 'Google Maps');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  centerChange(item: Detalhe): void {
    if (item?.position?.lat && item?.position?.lng) {
      this.center = { lat: item.position.lat, lng: item.position.lng };

      this.mapa?.panTo(this.center);
    }
  }

  gotoLink(url: string): void {
    window.open(url, '_blank', 'noopener');
  }

  markerMouseOver(marker: MapMarker): void {
    marker?.marker?.setAnimation(google.maps.Animation.BOUNCE);
  }

  markerMouseOut(marker: MapMarker): void {
    marker?.marker?.setAnimation(null);
  }

  onItemMouseEnter(markerId: number): void {
    const marker = this.obterMapMarkerAnimavel(markerId);

    if (marker) { this.markerMouseOver(marker); }
  }

  onItemMouseLeave(markerId: number): void {
    const marker = this.obterMapMarkerAnimavel(markerId);

    if (marker) { this.markerMouseOut(marker); }
  }

  openInfo(marker: MapMarker, content: string): void {
    this.infoContent = content;

    this.infoWindow?.open(marker);
  }

  showListItem(item?: Detalhe): void {
    this.detalheVisivel = !this.detalheVisivel;

    if (item) {
      this.dadosDoDetalhe = {
        Titulo: item.detalheLista2,
        Cabecalho: item.detalheLista3,
        Itens: item.detalheLista1
      };
    }
  }

  trackByDetalhe(_indice: number, item: Detalhe): number {
    return item.id;
  }

  trackByMarker(_indice: number, item: MarkerItem): number {
    return item.id;
  }

  trackByTrajeto(_indice: number, item: TrajetoMobile): number {
    return item.id;
  }

  tentarEnquadrar(): void {
    const googleMap = this.mapa?.googleMap;

    if (!this.enquadrarPendente || !googleMap || this.markersVisiveis.length === 0) { return; }

    this.enquadrarPendente = false;

    if (this.markersVisiveis.length === 1) {
      googleMap.panTo(this.markersVisiveis[0].position);
      googleMap.setZoom(15);

      return;
    }

    const bounds = new google.maps.LatLngBounds();

    this.markersVisiveis.forEach(item => bounds.extend(item.position));

    this.mapa?.fitBounds(bounds, 40);
  }

  public abrirMarkerPorId(markerId: number): void {
    const indice = this.markersVisiveis.findIndex(item => item.id === markerId);

    if (indice < 0) { return; }

    const item = this.markersVisiveis[indice];
    const marker = this.markerElements?.get(indice);

    this.markerSelecionadoTimeline = markerId;
    this.center = { lat: item.position.lat, lng: item.position.lng };

    this.mapa?.panTo(this.center);

    if (marker) { this.openInfo(marker, item.info); }
  }

  public carregarAbastecimentos(): void {
    this.abastecimento = !this.abastecimento;

    this.carregarMapa();
  }

  public carregarMonitoramentosEquipes(): void {
    this.monitoramentoEquipe = !this.monitoramentoEquipe;

    this.carregarMapa();
  }

  public carregarPontosControles(): void {
    this.pontoControle = !this.pontoControle;

    this.carregarMapa();
  }

  public carregarPostosCredenciados(): void {
    this.postoCredenciado = !this.postoCredenciado;

    this.carregarMapa();
  }

  public carregarRetiradasMateriais(): void {
    this.retiradaMaterial = !this.retiradaMaterial;

    this.carregarMapa();
  }

  public carregarVeiculos() {
    this.veiculo = !this.veiculo;

    this.carregarMapa();
  }

  public carregarListas() {
    this.builder.reiniciarContador();

    const abastecimento = this.builder.buildAbastecimento(this.retAbastecimento);

    this.listaAbastecimento = abastecimento.lista;
    this.detalheAbastecimento = abastecimento.detalhe;

    const pontoControle = this.builder.buildPontoControle(this.retPontoControle);

    this.listaPontoControle = pontoControle.lista;
    this.detalhePontoControle = pontoControle.detalhe;

    this.listaPostoCredenciado = this.builder.buildPostoCredenciado(this.retPostoCredenciado);

    const residencia = this.builder.buildResidencia(this.retResidencia);

    this.listaResidencia = residencia.lista;
    this.detalheResidencia = residencia.detalhe;

    const retiradaMaterial = this.builder.buildRetiradaMaterial(this.retRetiradaMaterial);

    this.listaRetiradaMaterial = retiradaMaterial.lista;
    this.detalheRetiradaMaterial = retiradaMaterial.detalhe;

    const veiculo = this.builder.buildVeiculo(this.retVeiculo);

    this.listaVeiculo = veiculo.lista;
    this.detalheVeiculo = veiculo.detalhe;

    this.aparelhosMobile = this.builder.buildRastreamentoMobile(this.retMonitoramentoEquipe);
  }

  public carregarMapa() {
    const clusterAbastecimento = (this.abastecimento ? this.ordenarHoraDesc(this.listaAbastecimento) : []);
    const clusterPontoControle = (this.pontoControle ? this.ordenarHoraDesc(this.listaPontoControle) : []);
    const clusterPostoCredenciado = (this.postoCredenciado ? this.ordenarHoraDesc(this.listaPostoCredenciado) : []);
    const clusterResidencia = (this.residenciaTecnico ? this.ordenarHoraDesc(this.listaResidencia) : []);
    const clusterRetiradaMaterial = (this.retiradaMaterial ? this.ordenarHoraDesc(this.listaRetiradaMaterial) : []);
    const clusterVeiculo = (this.veiculo ? this.ordenarHoraDesc(this.listaVeiculo) : []);
    const clusterMonitoramentoEquipe = this.ordenarHoraDesc(this.aparelhosMobile.flatMap(aparelho => aparelho.lista));

    const detalheAcumulado: Detalhe[] = [];

    if (this.abastecimento) { detalheAcumulado.push(...this.detalheAbastecimento); }
    if (this.pontoControle) { detalheAcumulado.push(...this.detalhePontoControle); }
    if (this.residenciaTecnico) { detalheAcumulado.push(...this.detalheResidencia); }
    if (this.retiradaMaterial) { detalheAcumulado.push(...this.detalheRetiradaMaterial); }
    if (this.veiculo) { detalheAcumulado.push(...this.detalheVeiculo); }

    this.markersVisiveis = [
      ...clusterAbastecimento,
      ...clusterPontoControle,
      ...clusterPostoCredenciado,
      ...clusterResidencia,
      ...clusterRetiradaMaterial,
      ...clusterVeiculo,
      ...clusterMonitoramentoEquipe
    ];

    const detalheOrdenado = this.ordenarHoraAsc(detalheAcumulado);
    const detalheMobile = (this.monitoramentoEquipe ? this.aparelhosMobile.map(aparelho => aparelho.detalhe) : []);
    const indiceResidencia = detalheOrdenado.map(item => item.tipo).lastIndexOf('Residencia');

    detalheOrdenado.splice((indiceResidencia + 1), 0, ...detalheMobile);

    this.detalhe = detalheOrdenado;

    this.trajetos = this.aparelhosMobile.map((aparelho, indice) => ({
      id: (indice + 1),
      path: this.ordenarHoraAsc(aparelho.lista).map(item => item.position),
      options: { ...this.polylineOptions, strokeColor: aparelho.cor }
    })).filter(trajeto => trajeto.path.length > 1);
  }

  public tratarErroRequisicao(erro: any, titulo: string): void {
    let msgErro = 'Ocorreu um erro. Entre em contato com o Suporte !';

    if (erro instanceof HttpErrorResponse) {
      msgErro = (typeof erro?.error === 'string' ? erro?.error : (erro?.error?.message || erro?.message || msgErro));
    } else if (erro?.message) {
      msgErro = erro.message;
    } else if (typeof erro === 'string' && erro) {
      msgErro = erro;
    }

    this.toastr.error(msgErro, titulo);

    this.carregando = false;
    this.temErro = true;
  }

  private chamarApiGEO() {
    this.limparDados();

    this.carregando = true;

    this.portalOsService.carregarDados()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (dados: DadosGeo) => this.aplicarDados(dados),
        (erro) => this.tratarErroRequisicao(erro, 'Portal OS')
      );
  }

  private aplicarDados(dados: DadosGeo): void {
    this.retAbastecimento = dados.abastecimentos;
    this.retMonitoramentoEquipe = dados.monitoramentosEquipes;
    this.retPontoControle = dados.pontosControles;
    this.retPostoCredenciado = dados.postosCredenciados;
    this.retResidencia = dados.residencias;
    this.retRetiradaMaterial = dados.retiradasMateriais;
    this.retVeiculo = dados.veiculos;

    this.qtdeDadosAbastecimento = this.retAbastecimento.length;
    this.qtdeDadosMonitoramentoEquipe = this.retMonitoramentoEquipe.length;
    this.qtdeDadosPontoControle = this.retPontoControle.length;
    this.qtdeDadosPostoCredenciado = this.retPostoCredenciado.length;
    this.qtdeDadosRetiradaMaterial = this.retRetiradaMaterial.length;
    this.qtdeDadosVeiculo = this.retVeiculo.length;

    if (this.retResidencia.length > 0) {
      this.center = { lat: this.retResidencia[0].latitude, lng: this.retResidencia[0].longitude };
    }

    this.carregarListas();
    this.carregarMapa();

    this.enquadrarPendente = true;
    this.carregando = false;

    this.tentarEnquadrar();
  }

  private limparDados(): void {
    this.temErro = false;
    this.enquadrarPendente = false;
    this.markerSelecionadoTimeline = undefined;

    this.qtdeDadosAbastecimento = 0;
    this.qtdeDadosMonitoramentoEquipe = 0;
    this.qtdeDadosPontoControle = 0;
    this.qtdeDadosPostoCredenciado = 0;
    this.qtdeDadosRetiradaMaterial = 0;
    this.qtdeDadosVeiculo = 0;

    this.detalhe = [];
    this.detalheAbastecimento = [];
    this.detalhePontoControle = [];
    this.detalheResidencia = [];
    this.detalheRetiradaMaterial = [];
    this.detalheVeiculo = [];

    this.listaAbastecimento = [];
    this.listaPontoControle = [];
    this.listaPostoCredenciado = [];
    this.listaResidencia = [];
    this.listaRetiradaMaterial = [];
    this.listaVeiculo = [];

    this.retAbastecimento = [];
    this.retMonitoramentoEquipe = [];
    this.retPontoControle = [];
    this.retPostoCredenciado = [];
    this.retResidencia = [];
    this.retRetiradaMaterial = [];
    this.retVeiculo = [];

    this.aparelhosMobile = [];
    this.markersVisiveis = [];
    this.trajetos = [];
  }

  private obterMapMarkerAnimavel(markerId: number): (MapMarker | undefined) {
    if (!markerId || markerId <= 0) { return undefined; }

    const indice = this.markersVisiveis.findIndex(item => item.id === markerId);

    if (indice < 0 || this.markersVisiveis[indice].semAnimacao) { return undefined; }

    return this.markerElements?.get(indice);
  }

  private ordenarHoraAsc<T extends { hora: string }>(lista: T[]): T[] {
    return [...lista].sort((a, b) => a.hora.localeCompare(b.hora));
  }

  private ordenarHoraDesc<T extends { hora: string }>(lista: T[]): T[] {
    return [...lista].sort((a, b) => b.hora.localeCompare(a.hora));
  }
}
