export interface AbastecimentoRaw {
  efd_recno: number;
  efd_placa: string;
  efd_hodom: (number | string);
  efd_horario_transacao: string;
  efd_qt_mater: (number | string);
  efd_dt_trans: (string | Date);
  poc_recno: number;
  poc_descricao: string;
  poc_latitude: number;
  poc_longitude: number;
}

export interface MonitoramentoEquipeRaw {
  idUsuario: number;
  idTel: string;
  nome: string;
  funcao: string;
  turnoCodigo: string;
  turnoDescricao: string;
  endereco?: (string | null);
  modeloAparelho: string;
  regraMonitoramento: string;
  situacaoFTD?: (string | null);
  situacaoFTDSigla?: (string | null);
  situacaoEscala?: (string | null);
  situacaoEscalaSigla?: (string | null);
  placa: string;
  gpsFake: string;
  dataCadastro: string;
  dataAtualizacao: string;
  mobile?: MobileRaw;
}

export interface MobileRaw {
  duracao: string;
  hint?: (string | null);
  horaAtual: string;
  iconeUrl: string;
  latitude: number;
  longitude: number;
  titulo?: (string | null);
}

export interface PontoControleRaw {
  id: number;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
}

export interface PostoCredenciadoRaw {
  poc_recno: number;
  poc_descricao: string;
  poc_endereco?: (string | null);
  poc_bairro?: (string | null);
  poc_cidade?: (string | null);
  poc_latitude: number;
  poc_longitude: number;
  poc_endereco_completo?: (string | null);
  pca_recno: number;
  pco_telefone?: (string | null);
}

export interface ResidenciaRaw {
  endereco: string;
  latitude: number;
  longitude: number;
}

export interface RetiradaMaterialRaw {
  id_tipo_documento: number;
  tipo_documento: string;
  visto_eletronico_link: string;
  usu_login: string;
  usu_nome: string;
  mev_data_movimento: string;
  trm_data_cadastro_mobile: (string | Date);
  predio: {
    pre_recno: number;
    cid_recno: number;
    cid_nome?: (string | null);
    est_uf?: (string | null);
    epp_recno: number;
    cpr_recno: number;
    itc_recno: number;
    usu_recno_cadastro: number;
    usu_recno_alteracao: number;
    pre_flag_devolvido: string;
    pre_data_devolucao?: (string | Date | null);
    pre_data_abertura: (string | Date);
    pre_data_cadastro: (string | Date);
    pre_data_alteracao: (string | Date);
    pre_endereco: string;
    pre_numero: string;
    pre_bairro: string;
    pre_cep: string;
    pre_bloqueado: string;
    pre_latitude: number;
    pre_longitude: number;
  };
  materialRetirada: [
    {
      data: string;
      pro_codigo: string;
      pro_descricao: string;
      und_codigo: string;
      quant: number;
    }
  ];
}

export interface VeiculoRaw {
  idtel: string;
  placa: string;
  latitude_inicio: number;
  latitude_termino: number;
  longitude_inicio: number;
  longitude_termino: number;
  data_inicio: string;
  data_termino: string;
  endereco_inicio: string;
  endereco_termino: string;
  tempo: string;
  quilometragem_percorrida: (number | string);
}

export interface DadosGeo {
  abastecimentos: AbastecimentoRaw[];
  monitoramentosEquipes: MonitoramentoEquipeRaw[];
  pontosControles: PontoControleRaw[];
  postosCredenciados: PostoCredenciadoRaw[];
  residencias: ResidenciaRaw[];
  retiradasMateriais: RetiradaMaterialRaw[];
  veiculos: VeiculoRaw[];
}

export interface Detalhe {
  id: number;
  titulo: string;
  tituloLink: string;
  tipo: string;
  detalhe1: string;
  detalhe2: string;
  detalhe3: string;
  detalhe4: string;
  detalhe5: string;
  detalhe6: string;
  detalhe7: string;
  detalhe8: string;
  detalheLista1: string[][];
  detalheLista2: string;
  detalheLista3: string[];
  detalheLista4: string;
  horaTitulo: string;
  hora: string;
  duracao: string;
  position: MapPosition;
  icon: MapIcon;
  visible: boolean;
}

export interface MapIcon {
  url?: (string | null);
  scaledSize?: (google.maps.Size | null);
  size?: (google.maps.Size | null);
  origin?: (google.maps.Point | null);
  anchor?: (google.maps.Point | null);
}

export interface MarkerItem {
  id: number;
  hora: string;
  horaTitulo: string;
  position: MapPosition;
  icon: (MapIcon | google.maps.Symbol);
  info: string;
  semAnimacao: boolean;
}

export interface MapPosition {
  lat: number;
  lng: number;
}
