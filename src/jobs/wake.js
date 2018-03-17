import ProgressJob from 'jobs/abstractProgressJob';

export default class Wake extends ProgressJob {

    constructor(api, options, message) {
        super('wake', options, message);
        this.api = api;
    }

    // eslint-disable-next-line class-methods-use-this
    tick(progress) {
        if (progress === 0) {
            return this.api.multistate({
                hue: 64,
                sat: 27,
                brightness: 0,
            });
        }
        return this.api.setBrightness(Math.round(progress * 100));
    }
}
