import config from "./config";

export default class index {
    constructor() {
        this.init();
    }

    init() {
        document.title = config.title;

    }

}
new index();