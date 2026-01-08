export enum SefazStatus {
    NORMAL = 1,
    LENTO = 2,
    MUITO_LENTO = 3,
    TIMEOUT = 4,
    ERRO = 5
}

export interface MonitorEstado {
    id: number;
    id_worker: string | null;
    status: SefazStatus;
    datahora: string;
    tempo: number;
    erro: string | null;
}
