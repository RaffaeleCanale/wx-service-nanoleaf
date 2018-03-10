import _ from 'lodash';
import ProgressJob from 'jobs/abstractProgressJob';

function rgb(r, g, b) {
    return { r, g, b };
}

function panel(id, r, g, b) {
    return { id, r, g, b }; // eslint-disable-line
}

function sameColor(c1, c2) {
    return c1.r === c2.r &&
        c1.g === c2.g &&
        c1.b === c2.b;
}

export default class Progress extends ProgressJob {

    constructor(api, options) {
        super('progress', options);

        if (!_.isArray(options.panels)) {
            throw new Error('Missing panels for job Progress');
        }

        this.api = api;
        this.panels = options.panels.map(id => panel(id, 0, 255, 0));
        this.unit = 1.0 / this.panels.length;
    }

/*
00 => {}
10 => {}
20 => {a}
30 => {A,b}
40 => {A,B}
50 => {A,B,c}
60 => {A,B,C}
70 => {A,B,C,d}
80 => {A,B,C,D}
90 => {A,B,C,D,e}
100 => {A,B,C,D,E}
*/
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



        // const panelId = this.panels[i];
        // const panelState = this.panelsState[i];
        //
        // if (!panelState) {
        //     const panels = [];
        //     for (let j = 0; j <= i; j += 1) {
        //         if (!this.panelsState[j]) {
        //             this.panelsState[j] = true;
        //             panels.push({
        //                 id: panelId,
        //                 r: 255,
        //                 g: 0,
        //                 b: 0,
        //             });
        //         }
        //     }
        //
        //     return this.api.setStaticPanel(panels);
        // }
        //
        // return Promise.resolve();
    }

    _apply(colors) {
        const toApply = [];
        for (let i = 0; i < this.panels.length; i += 1) {
            if (!sameColor(this.panels[i], colors[i])) {
                _.assign(this.panels[i], colors[i]);
                toApply.push(this.panels[i]);
            }
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
