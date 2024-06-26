export class config {
    static URL: string = '127.0.0.1'; // 服务器的 URL
    static HTTPPORT: number = 4100; // HTTP 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口
    static socketPort: number = 4200; // Socket.IO 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口
    static savePath: string = '../uploadFile'; // 上传文件的保存路径
    static dbPath: string = '../fsDatabase.sqlite';
    static tableName: string = 'fsTable';
    static version: string = "4.0.0"//版本号

    static loadConfig: { [key: string]: string } = {
        "/": "index.html",
        "/favicon.ico": "favicon.ico",
        "/pico.min.css": "pico.min.css",
        "/qrcode.min.js": "qrcode.min.js",
        "/vconsole.min.js": "vconsole.min.js",
        "/clipboard.min.js": "clipboard.min.js"
    }

    static serverConfigPath = "../serverConfig.json";




}
