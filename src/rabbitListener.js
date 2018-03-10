import _ from 'lodash';
import RabbitFactory from 'wx-client-rabbitmq';

export default class Listener {

    constructor(config, bindings) {
        this.factory = new RabbitFactory(_.omit(config, 'exchange'));
        this.bindings = bindings;
        this.exchange = config.exchange;
    }

    listen(consumer) {
        return this.factory.connect()
            .then(() => this.factory.getBroadcastReceiver(this.exchange, this.bindings))
            .then(ch => ch.consume(consumer));
    }

    close() {
        this.factory.close();
    }

}
