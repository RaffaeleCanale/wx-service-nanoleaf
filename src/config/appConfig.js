import Joi from 'joi';
import { readJsonFile } from 'js-utils/file-utils';

const schema = Joi.object().keys({
    nanoleaf: Joi.object().keys({
        host: Joi.string().required(),
        token: Joi.string().required(),
    }).required(),
    rabbitmq: Joi.object().keys({
        exchange: Joi.string().required(),
    }).unknown().required(),
}).required();

function validate(config) {
    return Joi.validate(config, schema);
}

export default function load(file) {
    return readJsonFile(file).then(validate)
        .catch((err) => {
            throw new Error(`Error while parsing config file: ${file}\n${err}`);
        });
}
