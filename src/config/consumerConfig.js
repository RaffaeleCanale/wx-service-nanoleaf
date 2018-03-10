import _ from 'lodash';
import { readJsonFile } from 'js-utils/file-utils';
import Jobs from 'jobs';

function parseJob(value) {
    const { job } = value;
    if (!job) {
        throw new Error('Must specify job name');
    }
    const JobClass = Jobs[job];
    if (!JobClass) {
        throw new Error(`Job ${job} not found`);
    }
    return _.assign(value, { JobClass });
}

function parseJobs(value) {
    if (_.isArray(value)) {
        return value.map(parseJob);
    }

    return [parseJob(value)];
}

function parse(config) {
    return _.mapValues(config, parseJobs);
}

export default function load(file) {
    return readJsonFile(file).then(parse)
        .catch((err) => {
            throw new Error(`Error while parsing consumer file: ${file}\n${err}`);
        });
}
