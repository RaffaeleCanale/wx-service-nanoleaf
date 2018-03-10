import { getLogger } from 'js-utils/logger';

export default class {

    constructor() {
        this.logger = getLogger('DEBUG');
    }

    setStaticPanel(...args) {
        this.logger.info('setStaticPanel', args);
        return Promise.resolve();
    }

    multistate(...args) {
        this.logger.info('multistate', args);
        return Promise.resolve();
    }

    setBrightness(...args) {
        this.logger.info('setBrightness', args);
        return Promise.resolve();
    }

    off(...args) {
        this.logger.info('off', args);
        return Promise.resolve();
    }

}
