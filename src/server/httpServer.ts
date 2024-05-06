import express, { Request, Response } from 'express';
import http from 'http';

import multer from 'multer';
import path from 'path';

import fs from 'fs';
import { config } from './config';

export class httpServer {
    private static fileHashes: string[];

    private static fileName2HashNameMap: Map<string, string>;
    private static hashName2FileNameMap: Map<string, string>;


    private static app: express.Express;
    private static server: http.Server;
    private static storage: multer.StorageEngine;
    private static upload: multer.Multer;

    private static savePath: string = "./uploadFile/";

    static async startHttpServer(port: number) {



        await new Promise((resolve, reject) => {
            this.checkUploadFileDir();
            this.app = express();
            this.server = http.createServer(this.app);
            this.storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.savePath);
                },
                filename: (req, file, cb) => {
                    let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
                }
            });
            this.upload = multer({ storage: this.storage });
            this.addEvent();
            resolve(this.startServer(this.server, port));
        });
    }

    private static async startServer(server: http.Server, port: number) {
        let self = this;
        await new Promise((resolve, reject) => {
            server.listen(port)
                .on('listening', () => {
                    console.log("http服务器已启动：");
                    console.log(`http://${config.URL}:${config.HTTPPORT}`);
                    resolve(null);
                })
                .on('error', (err: any) => {
                    if (err.code === 'EADDRINUSE') {
                        console.warn(`端口${port}已被占用，尝试使用端口${port + 10}`);
                        server.removeAllListeners('listening');
                        config.HTTPPORT = port + 10;
                        resolve(self.startServer(server, port + 10));
                    } else {
                        reject(err);
                        console.error(err);
                    }
                });
        });
    }

    private static checkUploadFileDir() {
        if (!fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath);
        }
    }

    private static addEvent() {
        this.onServerApi();
    }

    private static onServerApi() {
        this.onGetWebFileApi();
        this.onGetUploadFileApi();
    }


    private static onGetWebFileApi() {
        for (let key in config.loadConfig) {
            this.app.get(key, (req: Request, res: Response) => {
                res.sendFile(path.join(__dirname, '../client/' + config.loadConfig[key]));
            });
        }
        this.app.use('/client', express.static(path.join(__dirname, '../client')));
        this.app.get('/client/:file', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../client', req.params.file + '.js'));
        });
    }

    private static onGetUploadFileApi() {
        let self = this;
        this.app.get('/uploadFile/:filename', function (req, res) {
            const file = `${self.savePath}/${req.params.filename}`;
            const fileName = self.hashName2FileNameMap.get(req.params.filename);
            res.download(file, fileName!);
        });
    }
}
