import { getLogger } from 'js-utils/logger';

export default class Consumer {

    constructor(api, config) {
        this.config = config;
        this.api = api;
        this.jobsQueue = [];
        this.logger = getLogger('nanoleafConsumer');
    }

    _createJobs(message, binding) {
        const jobsConfig = this.config[binding];
        if (!jobsConfig) {
            this.logger.warn('No job found for', binding);
            return null;
        }

        try {
            return jobsConfig.map((jobConfig) => {
                const { JobClass } = jobConfig;
                const job = new JobClass(this.api, jobConfig, message);
                job.onstop = this._onstop.bind(this, job);
                return job;
            });
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    _stopJobs() {
        if (this.jobsQueue.length > 0) {
            this.jobsQueue.forEach(job => job.stop(true));
        }
        this.jobsQueue = [];
    }

    _startJobs(jobs) {
        this.jobsQueue = jobs;
        this.jobsQueue[0].start();
    }

    _onstop(job, interrupt) {
        if (!interrupt) {
            if (job != this.jobsQueue[0]) {
                this.logger.warn('Inconsistent state');
            }
            this.jobsQueue = this.jobsQueue.slice(1);
            if (this.jobsQueue.length > 0) {
                this.jobsQueue[0].start();
            }
        }
    }

    consume(message, binding) {
        const jobs = this._createJobs(message, binding);
        if (jobs) {
            this._stopJobs();
            this._startJobs(jobs);
        }
    }

}
