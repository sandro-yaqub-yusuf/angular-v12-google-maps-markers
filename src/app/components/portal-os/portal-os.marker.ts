import { formatDate } from "@angular/common";
import { AbastecimentoRaw, AparelhoMobile, Detalhe, MapIcon, MarkerItem, MonitoramentoEquipeRaw, PontoControleRaw, PostoCredenciadoRaw, ResidenciaRaw, RetiradaMaterialRaw, VeiculoRaw } from "./models/portal-os.model";

const ASSETS_IMG = 'assets/img/';
const TAMANHO_PIN = 43;
const CORES_TRAJETO = ['#5c7288', '#2288ee', '#8f58a7'];

interface DetalheBase {
  id: number;
  titulo: string;
  tituloLink?: string;
  tipo: string;
  detalhe1?: string;
  detalhe2?: string;
  detalhe3?: string;
  detalhe4?: string;
  detalhe5?: string;
  detalhe6?: string;
  detalhe7?: string;
  detalhe8?: string;
  detalheLista1?: string[][];
  detalheLista2?: string;
  detalheLista3?: string[];
  detalheLista4?: string;
  horaTitulo: string;
  hora: string;
  duracao?: string;
  lat: number;
  lng: number;
  iconeUrl: string;
}

interface MarkerBase {
  id: number;
  hora: string;
  horaTitulo: string;
  duracao?: string;
  lat: number;
  lng: number;
  iconeUrl: string;
  iconeSymbol?: google.maps.Symbol;
  tituloInfo: string;
  linhasInfo: Array<{ label: string; valor: (string | number) }>;
}

export class PortalOsMarker {
  private idAtual = 0;

  buildAbastecimento(itens: AbastecimentoRaw[]): { lista: MarkerItem[]; detalhe: Detalhe[] } {
    const lista: MarkerItem[] = [];
    const detalhe: Detalhe[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      const valido = this.posicaoValida(item.poc_latitude, item.poc_longitude);
      const hora = `${item.efd_horario_transacao}:00`;

      if (valido) {
        lista.push(this.criarMarker({
          id: this.idAtual,
          hora,
          horaTitulo: item.efd_horario_transacao,
          lat: item.poc_latitude,
          lng: item.poc_longitude,
          iconeUrl: 'abastecimento3_pin.png',
          tituloInfo: `<span class="badge badge-pink">${this.escapeHtml(item.efd_horario_transacao)}</span> - ABASTECIMENTO`,
          linhasInfo: [
            { label: 'Posto', valor: item.poc_recno },
            { label: 'Descrição', valor: item.poc_descricao },
            { label: 'Horário', valor: hora },
            { label: 'Valor', valor: item.efd_qt_mater },
            { label: 'Placa', valor: item.efd_placa },
            { label: 'Hodômetro', valor: item.efd_hodom }
          ]
        }));
      }

      detalhe.push(this.criarDetalhe({
        id: this.idAtual,
        titulo: 'Abastecimento',
        tipo: 'Abastecimento',
        detalhe1: `<b>Posto: </b>${this.escapeHtml(item.poc_recno)}`,
        detalhe2: `<b>Descrição: </b>${this.escapeHtml(item.poc_descricao)}`,
        detalhe3: `<b>Valor: </b>${this.escapeHtml(item.efd_qt_mater)}`,
        detalhe4: `<b>Placa: </b>${this.escapeHtml(item.efd_placa)}`,
        detalhe5: `<b>Hodômetro: </b>${this.escapeHtml(item.efd_hodom)}`,
        detalhe6: '',
        detalhe7: '',
        detalhe8: '',
        horaTitulo: item.efd_horario_transacao,
        hora,
        lat: item.poc_latitude,
        lng: item.poc_longitude,
        iconeUrl: 'abastecimento3_pin.png'
      }, valido));
    }

    return { lista, detalhe };
  }

  buildPontoControle(itens: PontoControleRaw[]): { lista: MarkerItem[]; detalhe: Detalhe[] } {
    const lista: MarkerItem[] = [];
    const detalhe: Detalhe[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      const valido = this.posicaoValida(item.latitude, item.longitude);

      if (valido) {
        lista.push(this.criarMarker({
          id: this.idAtual,
          hora: '23:59:51',
          horaTitulo: '',
          lat: item.latitude,
          lng: item.longitude,
          iconeUrl: 'pontocontrole3_pin.png',
          tituloInfo: 'PONTO DE CONTROLE',
          linhasInfo: [
            { label: 'ID', valor: item.id },
            { label: 'Localidade', valor: item.nome },
            { label: 'Endereço', valor: (item.endereco ?? '') }
          ]
        }));
      }

      detalhe.push(this.criarDetalhe({
        id: this.idAtual,
        titulo: 'Ponto de Controle',
        tipo: 'Ponto de Controle',
        detalhe1: `<b>ID: </b>${this.escapeHtml(item.id)}`,
        detalhe2: `<b>Localidade: </b>${this.escapeHtml(item.nome)}`,
        detalhe3: `<b>Endereço: </b>${this.escapeHtml(item.endereco ?? '')}`,
        detalhe4: '',
        detalhe5: '',
        detalhe6: '',
        detalhe7: '',
        detalhe8: '',
        horaTitulo: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
        hora: '23:59:51',
        lat: item.latitude,
        lng: item.longitude,
        iconeUrl: 'pontocontrole3_pin.png'
      }, valido));
    }

    return { lista, detalhe };
  }

  buildPostoCredenciado(itens: PostoCredenciadoRaw[]): MarkerItem[] {
    const lista: MarkerItem[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      if (!this.posicaoValida(item.poc_latitude, item.poc_longitude)) { continue; }

      lista.push(this.criarMarker({
        id: this.idAtual,
        hora: '23:59:59',
        horaTitulo: '',
        lat: item.poc_latitude,
        lng: item.poc_longitude,
        iconeUrl: 'gas2_pin.png',
        tituloInfo: 'POSTO CREDENCIADO',
        linhasInfo: [
          { label: 'Posto', valor: item.poc_recno },
          { label: 'Descrição', valor: item.poc_descricao }
        ]
      }));
    }

    return lista;
  }

  buildRastreamentoMobile(itens: MonitoramentoEquipeRaw[]): AparelhoMobile[] {
    return this.agruparPorAparelho(itens).map((grupo, indiceGrupo) => {
      const dados = grupo.dados;
      const lista: MarkerItem[] = [];
      const indiceUltimo = this.indiceUltimoPontoValido(dados);
      const rotacoes = this.calcularRotacoesTrajeto(dados);

      dados.forEach((item, indice) => {
        this.idAtual++;

        if (!this.mobileValido(item)) { return; }

        const mobile = item.mobile;
        const isUltimo = (indice === indiceUltimo);
        const horaTitulo = (mobile?.horaAtual ?? '');
        const hora = (item.dataCadastro?.substring(11, 19) ?? '');
        const duracao = (mobile?.duracao?.substring(0, 5) ?? '');

        lista.push(this.criarMarker({
          id: this.idAtual,
          hora,
          horaTitulo,
          lat: (mobile?.latitude ?? 0),
          lng: (mobile?.longitude ?? 0),
          iconeUrl: 'phone4_pin.png',
          iconeSymbol: (isUltimo ? undefined : this.iconTrajeto(rotacoes.get(indice) ?? 0)),
          tituloInfo: `<span class="badge badge-blue3">${this.escapeHtml(horaTitulo)}</span> - ${this.escapeHtml(item.nome)}`,
          linhasInfo: [
            { label: 'IDTel', valor: item.idTel },
            { label: 'Função', valor: item.funcao },
            { label: 'Turno', valor: item.turnoDescricao },
            { label: 'Aparelho', valor: item.modeloAparelho },
            { label: 'Permanência', valor: duracao }
          ]
        }));
      });

      this.idAtual++;

      const ultimo = (indiceUltimo >= 0 ? dados[indiceUltimo] : undefined);
      const horaInicial = dados
        .map(item => (item.dataCadastro?.substring(11, 19) ?? ''))
        .filter(hora => hora.length > 0)
        .sort((a, b) => a.localeCompare(b))[0];

      const detalhe = this.criarDetalhe({
        id: this.idAtual,
        titulo: 'Rastreamento Mobile',
        tipo: 'Rastreamento Mobile',
        detalhe1: `<b>Aparelho: </b>${this.escapeHtml(grupo.nome)}`,
        horaTitulo: '',
        hora: (horaInicial ?? ''),
        lat: (ultimo?.mobile?.latitude ?? 0),
        lng: (ultimo?.mobile?.longitude ?? 0),
        iconeUrl: 'phone4_pin.png'
      }, (indiceUltimo >= 0));

      return {
        nome: grupo.nome,
        cor: CORES_TRAJETO[indiceGrupo % CORES_TRAJETO.length],
        dados,
        lista,
        detalhe
      };
    });
  }

  buildResidencia(itens: ResidenciaRaw[]): { lista: MarkerItem[]; detalhe: Detalhe[] } {
    const lista: MarkerItem[] = [];
    const detalhe: Detalhe[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      const valido = this.posicaoValida(item.latitude, item.longitude);

      if (valido) {
        lista.push(this.criarMarker({
          id: this.idAtual,
          hora: '00:00:01',
          horaTitulo: '',
          lat: item.latitude,
          lng: item.longitude,
          iconeUrl: 'house2_pin.png',
          tituloInfo: 'RESIDÊNCIA DO TÉCNICO',
          linhasInfo: [{ label: 'Endereço', valor: item.endereco }]
        }));
      }

      detalhe.push(this.criarDetalhe({
        id: this.idAtual,
        titulo: 'Residência do Técnico',
        tipo: 'Residencia',
        detalhe1: `<b>Endereço: </b>${this.escapeHtml(item.endereco)}`,
        horaTitulo: '',
        hora: '00:00:01',
        lat: item.latitude,
        lng: item.longitude,
        iconeUrl: 'house2_pin.png'
      }, valido));
    }

    return { lista, detalhe };
  }

  buildRetiradaMaterial(itens: RetiradaMaterialRaw[]): { lista: MarkerItem[]; detalhe: Detalhe[] } {
    const lista: MarkerItem[] = [];
    const detalhe: Detalhe[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      const valido = this.posicaoValida(item.predio.pre_latitude, item.predio.pre_longitude);
      const horaTitulo = this.substrHora(item.mev_data_movimento, 5);
      const hora = this.substrHora(item.mev_data_movimento, 8);
      const ehEntradaPredio = (item.id_tipo_documento === 2);

      const linha1 = (ehEntradaPredio
        ? `<b>Endereço: </b>${this.escapeHtml(item.predio.pre_endereco + ',' + item.predio.pre_numero)}`
        : `<b>IDTel Origem: </b>${this.escapeHtml(item.usu_login)}`);
      const linha2 = (ehEntradaPredio
        ? `<b>Bairro: </b>${this.escapeHtml(item.predio.pre_bairro)}`
        : `<b>Nome Origem: </b>${this.escapeHtml(item.usu_nome)}`);
      const linha3 = (ehEntradaPredio
        ? `<b>CEP: </b>${this.escapeHtml(item.predio.pre_cep)}`
        : `<b>Data Transferência: </b>${this.escapeHtml(item.trm_data_cadastro_mobile ? formatDate(item.trm_data_cadastro_mobile, 'dd/MM/yyyy', 'pt-BR') : '')}`);

      if (valido) {
        lista.push(this.criarMarker({
          id: this.idAtual,
          hora,
          horaTitulo,
          lat: item.predio.pre_latitude,
          lng: item.predio.pre_longitude,
          iconeUrl: 'retirada_pin.png',
          tituloInfo: `<span class="badge badge-blue2">${this.escapeHtml(horaTitulo)}</span> - RETIRADA DE MATERIAL`,
          linhasInfo: [
            { label: (ehEntradaPredio ? 'Endereço' : 'IDTel Origem'), valor: (ehEntradaPredio ? `${item.predio.pre_endereco},${item.predio.pre_numero}` : item.usu_login) },
            { label: (ehEntradaPredio ? 'Bairro' : 'Nome Origem'), valor: (ehEntradaPredio ? item.predio.pre_bairro : item.usu_nome) },
            { label: (ehEntradaPredio ? 'CEP' : 'Data Transferência'), valor: (ehEntradaPredio ? item.predio.pre_cep : (item.trm_data_cadastro_mobile ? formatDate(item.trm_data_cadastro_mobile, 'dd/MM/yyyy', 'pt-BR') : '')) }
          ]
        }));
      }

      detalhe.push(this.criarDetalhe({
        id: this.idAtual,
        titulo: item.tipo_documento,
        tituloLink: item.visto_eletronico_link,
        tipo: 'Retirada de Material',
        detalhe1: linha1,
        detalhe2: linha2,
        detalhe3: linha3,
        detalhe4: '',
        detalhe5: '',
        detalhe6: '',
        detalhe7: '',
        detalhe8: '',
        horaTitulo,
        hora,
        lat: item.predio.pre_latitude,
        lng: item.predio.pre_longitude,
        iconeUrl: 'retirada_pin.png'
      }, valido));
    }

    return { lista, detalhe };
  }

  public buildVeiculo(itens: VeiculoRaw[]): { lista: MarkerItem[]; detalhe: Detalhe[] } {
    const lista: MarkerItem[] = [];
    const detalhe: Detalhe[] = [];

    for (const item of (itens ?? [])) {
      this.idAtual++;

      const valido = this.posicaoValida(item.latitude_inicio, item.longitude_inicio);
      const horaTitulo = this.substrHora(item.data_inicio, 5);
      const hora = this.substrHora(item.data_inicio, 8);

      if (valido) {
        lista.push(this.criarMarker({
          id: this.idAtual,
          hora,
          horaTitulo,
          lat: item.latitude_inicio,
          lng: item.longitude_inicio,
          iconeUrl: 'car4_pin.png',
          tituloInfo: `<span class="badge badge-blue1">${this.escapeHtml(horaTitulo)}</span> - PARADA - ITURAN`,
          linhasInfo: [
            { label: 'Placa Veículo', valor: item.placa },
            { label: 'Início Viagem', valor: this.substrHora(item.data_inicio, 8) },
            { label: 'Local Início', valor: (item.endereco_inicio ?? '') },
            { label: 'Término Viagem', valor: this.substrHora(item.data_termino, 8) },
            { label: 'Local Término', valor: (item.endereco_termino ?? '') },
            { label: 'Duração', valor: item.tempo },
            { label: 'KM Percorridos', valor: item.quilometragem_percorrida }
          ]
        }));
      }

      detalhe.push(this.criarDetalhe({
        id: this.idAtual,
        titulo: item.placa,
        tipo: 'Parada - Ituran',
        detalhe1: '<b>Rastreador: </b>Ituran',
        detalhe2: `<b>Placa Veículo: </b>${this.escapeHtml(item.placa)}`,
        detalhe3: `<b>Início Viagem: </b>${this.escapeHtml(this.substrHora(item.data_inicio, 8))}`,
        detalhe4: `<b>Local Início: </b>${this.escapeHtml(item.endereco_inicio ?? '')}`,
        detalhe5: `<b>Término Viagem: </b>${this.escapeHtml(this.substrHora(item.data_termino, 8))}`,
        detalhe6: `<b>Local Término: </b>${this.escapeHtml(item.endereco_termino ?? '')}`,
        detalhe7: `<b>Duração: </b>${this.escapeHtml(item.tempo)}`,
        detalhe8: `<b>KM Percorridos: </b>${this.escapeHtml(item.quilometragem_percorrida)}`,
        horaTitulo,
        hora,
        lat: item.latitude_inicio,
        lng: item.longitude_inicio,
        iconeUrl: 'car4_pin.png'
      }, valido));
    }

    return { lista, detalhe };
  }

  public reiniciarContador() {
    this.idAtual = 0;
  }

  private criarDetalhe(base: DetalheBase, visible: boolean): Detalhe {
    return {
      id: base.id,
      titulo: base.titulo,
      tituloLink: (base.tituloLink ?? ''),
      tipo: base.tipo,
      detalhe1: (base.detalhe1 ?? ''),
      detalhe2: (base.detalhe2 ?? ''),
      detalhe3: (base.detalhe3 ?? ''),
      detalhe4: (base.detalhe4 ?? ''),
      detalhe5: (base.detalhe5 ?? ''),
      detalhe6: (base.detalhe6 ?? ''),
      detalhe7: (base.detalhe7 ?? ''),
      detalhe8: (base.detalhe8 ?? ''),
      detalheLista1: (base.detalheLista1 ?? []),
      detalheLista2: (base.detalheLista2 ?? ''),
      detalheLista3: (base.detalheLista3 ?? []),
      detalheLista4: (base.detalheLista4 ?? ''),
      horaTitulo: base.horaTitulo,
      hora: base.hora,
      duracao: (base.duracao ?? ''),
      position: { lat: base.lat, lng: base.lng },
      icon: this.icon(base.iconeUrl),
      visible
    };
  }

  private criarMarker(base: MarkerBase): MarkerItem {
    return {
      id: base.id,
      hora: base.hora,
      horaTitulo: base.horaTitulo,
      position: { lat: base.lat, lng: base.lng },
      icon: (base.iconeSymbol ?? this.icon(base.iconeUrl)),
      info: this.montarInfoWindow(base.tituloInfo, base.linhasInfo, base.lat, base.lng, base.duracao),
      semAnimacao: !!base.iconeSymbol
    };
  }

  private agruparPorAparelho(itens: MonitoramentoEquipeRaw[]): Array<{ nome: string; dados: MonitoramentoEquipeRaw[] }> {
    const grupos = new Map<string, MonitoramentoEquipeRaw[]>();

    (itens ?? []).forEach(item => {
      const chave = this.chaveAparelho(item);
      const dados = grupos.get(chave);

      if (dados) { dados.push(item); } 
      else { grupos.set(chave, [item]); }
    });

    const resultado: Array<{ nome: string; dados: MonitoramentoEquipeRaw[] }> = [];

    grupos.forEach((dados, nome) => resultado.push({ nome, dados }));

    return resultado
      .map((grupo, indice) => ({ grupo, indice, primeiraInclusao: this.primeiraInclusao(grupo.dados) }))
      .sort((a, b) => (a.primeiraInclusao.localeCompare(b.primeiraInclusao) || (a.indice - b.indice)))
      .map(item => item.grupo);
  }

  private primeiraInclusao(dados: MonitoramentoEquipeRaw[]): string {
    const datas = dados.map(item => (item.dataCadastro ?? '')).filter(data => data.length > 0).sort((a, b) => a.localeCompare(b));

    return (datas[0] ?? '');
  }

  private chaveAparelho(item: MonitoramentoEquipeRaw): string {
    const nome = (item?.modeloAparelho ?? '').trim();

    return (nome.length > 0 ? nome : 'Aparelho não identificado');
  }

  private calcularRumo(origem: google.maps.LatLngLiteral, destino: google.maps.LatLngLiteral): number {
    const rad = (Math.PI / 180);
    const phi1 = (origem.lat * rad);
    const phi2 = (destino.lat * rad);
    const deltaLambda = ((destino.lng - origem.lng) * rad)  ;
    const y = (Math.sin(deltaLambda) * Math.cos(phi2));
    const x = (Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda));

    return (((Math.atan2(y, x) / rad) + 360) % 360);
  }

  private calcularRotacoesTrajeto(itens: MonitoramentoEquipeRaw[]): Map<number, number> {
    const rotacoes = new Map<number, number>();
    const pontos = itens
      .map((item, indice) => ({
        indice,
        hora: (item.dataCadastro?.substring(11, 19) ?? ''),
        posicao: { lat: (item.mobile?.latitude ?? 0), lng: (item.mobile?.longitude ?? 0) },
        valido: this.mobileValido(item)
      }))
      .filter(ponto => ponto.valido)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    const mesmaPosicao = (a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): boolean => ((a.lat === b.lat) && (a.lng === b.lng));

    pontos.forEach((ponto, i) => {
      let rumo = 0;
      const proximo = pontos.slice(i + 1).find(p => !mesmaPosicao(p.posicao, ponto.posicao));

      if (proximo) {
        rumo = this.calcularRumo(ponto.posicao, proximo.posicao);
      } else {
        const anterior = pontos.slice(0, i).reverse().find(p => !mesmaPosicao(p.posicao, ponto.posicao));

        if (anterior) { rumo = this.calcularRumo(anterior.posicao, ponto.posicao); }
      }

      rotacoes.set(ponto.indice, rumo);
    });

    return rotacoes;
  }

  private escapeHtml(valor: (string | number)): string {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private icon(iconeUrl: string): MapIcon {
    return { url: (iconeUrl ? ASSETS_IMG + iconeUrl : undefined), scaledSize: { height: TAMANHO_PIN, width: TAMANHO_PIN } as google.maps.Size };
  }

  private iconTrajeto(rotacao: number): google.maps.Symbol {
    return {
      path: 'M 0,-8 L 8,7 L 0,3 L -8,7 Z',
      fillColor: '#06163a',
      fillOpacity: 0.7,
      strokeColor: '#ffffff',
      strokeWeight: 1,
      scale: 0.8,
      anchor: new google.maps.Point(0, 0),
      rotation: rotacao
    };
  }

  private montarInfoWindow(tituloHtml: string, linhas: Array<{ label: string; valor: (string | number) }>, lat: number, lng: number, duracao?: string): string {
    const corpo = linhas.map((linha, indice) => `<div${indice === 0 ? ' class="mt-2"' : ''}><b>${this.escapeHtml(linha.label)}: </b>${this.escapeHtml(linha.valor)}<br></div>`).join('');
    const linhaDuracao = (duracao ? `<div><b>Permanência: </b>${this.escapeHtml(duracao)}<br></div>` : '');

    return `<div class="row m-0">
              <div class="col-12 p-0 text-left mapa-detalhe">
                <div class="titulo-mobile"><b>${tituloHtml ?? ''}</b><br></div>
                ${corpo}
                ${linhaDuracao}
                <div class="text-center mt-2"><a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate" target="_blank" rel="noopener noreferrer">Iniciar Navegação</a></div>
              </div>
            </div>`;
  }

  private indiceUltimoPontoValido(itens: MonitoramentoEquipeRaw[]): number {
    let indiceUltimo = -1;

    itens.forEach((item, indice) => {
      if (!this.mobileValido(item)) { return; }

      if (indiceUltimo < 0 || (item.dataCadastro ?? '') >= (itens[indiceUltimo].dataCadastro ?? '')) {
        indiceUltimo = indice;
      }
    });

    return indiceUltimo;
  }

  private mobileValido(item: MonitoramentoEquipeRaw): boolean {
    return !!(item.mobile?.latitude && item.mobile?.longitude);
  }

  private posicaoValida(lat: number, lng: number): boolean {
    return !!(lat && lng);
  }

  private substrHora(dataHora: string, tamanho: number): string {
    return (dataHora ? dataHora.slice(-8).substring(0, tamanho) : '');
  }
}
