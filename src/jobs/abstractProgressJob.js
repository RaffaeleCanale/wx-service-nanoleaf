import Interval from 'js-utils/interval';
import { getLogger } from 'js-utils/logger';
import { parse, msToTime } from 'utils/timeUtils';

const DEFAULT_TICK_RATE = 2000;

function getTickRate(tickRate) {
    return tickRate ? parse(tickRate) : DEFAULT_TICK_RATE;
}

export default class ProgressJob extends Interval {

    constructor(jobName, options, message) {
        super(getTickRate(options.tickRate));
        this.logger = getLogger(`aurora.${jobName}`);

        const { duration } = _.assign(options, message);
        if (!duration) {
            throw new Error(`Missing duration for job ${this.jobName}`);
        }
        this.duration = parse(duration);
    }

    onstart() {
        this._start = Date.now();
        this._firstTick = true;
        this.logger.verbose('Starting progress job with duration', msToTime(this.duration));
    }

    run() {
        const progress = this._firstTick ? 0 : this._getProgress();
        if (progress >= 1) {
            return this.tick(1.0)
                .catch(this.logger.error)
                .then(() => this.stop());
        }

        this._firstTick = false;
        this.logger.verbose(`Progress: ${(progress * 100.0).toFixed(2)}%`);
        return this.tick(progress).catch(this.logger.error);
    }

    _getProgress() {
        return (Date.now() - this._start) / this.duration;
    }

}
