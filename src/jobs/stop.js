export default class {

    constructor(api) {
        this.api = api;
    }

    start() {
        return this.api.off();
    }

    // eslint-disable-next-line
    stop() {
        // noop
    }

}
