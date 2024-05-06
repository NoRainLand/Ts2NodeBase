import open from 'open';
import * as os from 'os';
import { config } from './config';
import { httpServer } from './httpServer';
export default class index {

    webUrl: string = '';

    constructor() {
        this.init();
    }

    async init() {
        config.URL = this.getLocalIP();
        await httpServer.startHttpServer(config.HTTPPORT);
        this.webUrl = `http://${config.URL}:${config.HTTPPORT}`;
        await open(this.webUrl);
    }

    getLocalIP() {
        const interfaces = os.networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface!.length; i++) {
                let alias = iface![i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        console.warn("无法获取本机IP地址");
        return '127.0.0.1';
    }
}

new index();