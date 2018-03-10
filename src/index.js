import AuroraAPI from 'nanoleaves';
import minimist from 'minimist';
import Chain from 'js-utils/chain';

import RabbitListener from 'rabbitListener';
import Consumer from 'consumer';
import configLoad from 'config/appConfig';
import consumerLoad from 'config/consumerConfig';
import MockApi from 'utils/mockApi';

const argv = minimist(process.argv.slice(2));
const { debug } = argv;

const initFunctions = {

    loadConfig(file) {
        return configLoad(file).then((config) => {
            this.config = config;
        });
    },

    loadAuroraApi() {
        this.auroraApi = debug ?
            new MockApi(this.config.nanoleaf) :
            new AuroraAPI(this.config.nanoleaf);
    },

    loadRabbitListener() {
        const bindings = _.keys(this.consumer.config);
        this.rabbitListener = new RabbitListener(this.config.rabbitmq, bindings);
    },

    loadConsumer(file) {
        return consumerLoad(file).then((config) => {
            this.consumer = new Consumer(this.auroraApi, config);
        });
    },

    listen() {
        if (debug) {
            this.consumer.consume('', debug);
        } else {
            this.rabbitListener.listen(this.consumer.consume.bind(this.consumer));
        }
    },
};


new Chain(initFunctions)
    .loadConfig('./config.json')
    .loadAuroraApi()
    .loadConsumer('./consumer.json')
    .loadRabbitListener()
    .listen()
    .execute();
