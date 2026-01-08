import axios from 'axios';
import { Logger } from '../utils/Logger.js';

export class DiscordNotifier {
    static async enviarMensagem(webhookUrl: string, mensagem: string): Promise<void> {
        try {
            await axios.post(webhookUrl, { content: mensagem });
        } catch (error: any) {
            Logger.error(`Falha ao enviar notificação para o Discord: ${error.message}`);
        }
    }
}
