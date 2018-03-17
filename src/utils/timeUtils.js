import _ from 'lodash';

function removeSuffix(string, n) {
    return string.substring(0, string.length - n);
}

export function seconds(s) {
    return s * 1000;
}

export function minutes(m) {
    return seconds(60 * m);
}

export function hours(h) {
    return minutes(60 * h);
}

export function parse(string) {
    let unit;
    if (string.endsWith('ms')) {
        unit = _.identity;
        string = removeSuffix(string, 2);
    } else if (string.endsWith('s')) {
        unit = seconds;
        string = removeSuffix(string, 1);
    } else if (string.endsWith('m')) {
        unit = minutes;
        string = removeSuffix(string, 1);
    } else if (string.endsWith('h')) {
        unit = hours;
        string = removeSuffix(string, 1);
    } else {
        unit = _.identity;
    }

    const time = _.toNumber(string);
    if (isNaN(time)) {
        throw new Error(`Not a number: ${string}`);
    }

    return unit(time);
}

export function msToTime(duration) {
    const ms = parseInt((duration % 1000) / 100, 10);
    let s = parseInt((duration / 1000) % 60, 10);
    let m = parseInt((duration / (1000 * 60)) % 60, 10);
    let h = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;

    return `${h}:${m}:${s}.${ms}`;
}
