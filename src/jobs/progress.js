import _ from 'lodash';
import ProgressJob from 'jobs/abstractProgressJob';

function round(color) {
    return _.assign({}, color, {
        r: Math.round(color.r),
        g: Math.round(color.g),
        b: Math.round(color.b),
    });
}

function rgb(r, g, b) {
    return round({ r, g, b });
}

function panel(id, r, g, b) {
    return round({ id, r, g, b }); // eslint-disable-line
}

function sameColor(c1, c2) {
    return c1.r === c2.r &&
        c1.g === c2.g &&
        c1.b === c2.b;
}

export default class Progress extends ProgressJob {

    constructor(api, options, message) {
        super('progress', options, message);

        if (!_.isArray(options.panels)) {
            throw new Error('Missing panels for job Progress');
        }

        this.api = api;
        this.panels = options.panels.map(id => panel(id, 0, 255, 0));
        this.unit = 1.0 / this.panels.length;
    }

    _turnPanelOn(progress) {
        const panels = [];
        const currentIndex = Math.floor(progress / this.unit);
        for (let i = 0; i < currentIndex; i += 1) {
            panels[i] = rgb(255, 0, 0);
        }
        if (currentIndex < this.panels.length) {
            const subProgress = (progress % this.unit) / this.unit;
            panels[currentIndex] = rgb(255 * subProgress, 255 * (1 - subProgress), 0);
        }
        for (let i = currentIndex + 1; i < this.panels.length; i += 1) {
            panels[i] = rgb(0, 255, 0);
        }

        return this._apply(panels);
    }

    _apply(colors) {
        const toApply = [];
        for (let i = 0; i < this.panels.length; i += 1) {
            if (!sameColor(this.panels[i], colors[i])) {
                _.assign(this.panels[i], colors[i]);
                toApply.push(this.panels[i]);
            }
        }

        if (toApply.length === 0) {
            return Promise.resolve();
        }

        return this.api.setStaticPanel(toApply);
    }

    // eslint-disable-next-line class-methods-use-this
    _init() {
        return this.api.multistate({
            hue: 120,
            sat: 100,
            brightness: 100,
        });
    }

    tick(progress) {
        if (progress === 0) {
            return this._init();
        }
        return this._turnPanelOn(progress);
    }
}
