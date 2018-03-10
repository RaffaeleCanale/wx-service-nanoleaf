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
