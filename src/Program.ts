import axios from 'axios';
import { SefazStatus, type MonitorEstado } from './models/MonitorStatus.js';
import { DiscordNotifier } from './models/DiscordNotifier.js';
import { Logger } from './utils/Logger.js';
import { Config } from './config/Config.js';

class SefazMonitor {
    private erroDetectado: Map<string, Date | null> = new Map();

    public async start(): Promise<void> {
        Logger.info("Monitor SEFAZ iniciado!");

        while (true) {
            await this.verificarTodosEstados();
            Logger.debug("Verificação de servidores concluída.");
            await new Promise(resolve => setTimeout(resolve, Config.checkIntervalMs));
        }
    }

    private async verificarTodosEstados(): Promise<void> {
        await Promise.all(Config.ufs.map(uf => this.verificarEstado(uf)));
    }

    private async verificarEstado(uf: string): Promise<void> {
        const url = `https://monitor.tecnospeed.com.br/monitores?current=true&worker_id=sefaz_nfce_envio_${uf}`;
        
        try {
            const { data } = await axios.get<MonitorEstado[]>(url);
            const estado = data?.[0];

            if (!estado) return;

            const { status } = estado;

            if (status === SefazStatus.NORMAL) {
                await this.tratarStatusNormal(uf);
            } else {
                await this.tratarStatusInstavel(uf, status);
            }
        } catch (error: any) {
            Logger.error(`Erro ao consultar ${uf.toUpperCase()}: ${error.message}`);
        }
    }

    private async tratarStatusNormal(uf: string): Promise<void> {
        if (!this.erroDetectado.has(uf)) return;

        const inicioErro = this.erroDetectado.get(uf);

        if (inicioErro === null) {
            const mensagem = `✅ __**Instabilidade na SEFAZ encerrada:**__ ✅\n\n` +
                             `**Estado:** ${uf.toUpperCase()}\n` +
                             `**Horário:** ${new Date().toLocaleTimeString('pt-BR')}\n` +
                             `@here`;
            
            await DiscordNotifier.enviarMensagem(Config.discordWebhook, mensagem);
            Logger.success(`${uf.toUpperCase()} voltou ao normal. Alerta de encerramento enviado.`);
        } else {
            Logger.success(`${uf.toUpperCase()} voltou ao normal antes do tempo mínimo de alerta.`);
        }

        this.erroDetectado.delete(uf);
    }

    private async tratarStatusInstavel(uf: string, status: SefazStatus): Promise<void> {
        if (!this.erroDetectado.has(uf)) {
            this.erroDetectado.set(uf, new Date());
            Logger.warn(`${uf.toUpperCase()} em instabilidade: ${SefazStatus[status]}`);
            return;
        }

        const inicioErro = this.erroDetectado.get(uf);
        if (!(inicioErro instanceof Date)) return;

        const agora = new Date();
        const diffMinutes = (agora.getTime() - inicioErro.getTime()) / (1000 * 60);

        if (diffMinutes >= Config.minErrorDurationMinutes) {
            const mensagem = `⚠️ __**Instabilidade na SEFAZ detectada:**__ ⚠️\n\n` +
                             `**Estado:** ${uf.toUpperCase()}\n` +
                             `**Início:** ${inicioErro.toLocaleTimeString('pt-BR')}\n` +
                             `**Status:** ${SefazStatus[status]}\n` +
                             `@here`;

            await DiscordNotifier.enviarMensagem(Config.discordWebhook, mensagem);
            Logger.error(`Alerta de instabilidade enviado para ${uf.toUpperCase()}.`);

            this.erroDetectado.set(uf, null);
        }
    }
}

const monitor = new SefazMonitor();
monitor.start();
