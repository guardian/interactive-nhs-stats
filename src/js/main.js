import reqwest from 'reqwest'
import doT from 'olado/doT'
import share from './lib/share'
import sheetURL from './lib/sheetURL'
import groupBy from './lib/groupBy'
import chart from './lib/chart'

import mainHTML from './text/main.html!text'

const docID = '1_z0hqi6kD1o9qmSl7xwvP__bIkaC060uIB2cv8eNS2Y';
const sheetID = '1D12VO4GvbCOHoD6_TNVcmtR2EU0JDxIfzb5ZuO6m-5k';

const headers = ['series', 'year', 'month', 'week'];

var templateFn = doT.template(mainHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}

function parseNumber(s) {
    return parseInt(s.replace(/,/g, ''));
}

function last(array) {
    return array[array.length - 1];
}

function app(el, config, doc, sheet) {
    var shareFn = share(doc.furniture.headline, doc.furniture.shortURL, doc.furniture.hashtag);

    // filter out standard headers
    var types = Object.keys(sheet.sheets.data[0]).filter(type => headers.indexOf(type) === -1);

    var stats = {};
    types.forEach(type => {
        var typeStats = sheet.sheets.data.map(row => {
            return {
                'series': parseNumber(row.series),
                'year': parseNumber(row.year),
                'month': row.month,
                'week': parseNumber(row.week),
                'value': parseNumber(row[type])
            };
        });
        stats[type] = groupBy(typeStats, 'series');
    });

    doc.sections.forEach(section => {
        var latestStat = last(last(stats[section.type]).value.filter(stat => !isNaN(stat.value)));
        section.stat = section.stat.replace('{x}', latestStat.value.toLocaleString());
    });

    el.innerHTML = templateFn(doc);

    $$('.js-chart').forEach(chartEl => chart(chartEl, stats[type]));

    $$('.interactive-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}

export function init(el, context, config, mediator) {
    var docReq = reqwest({
        url: sheetURL(docID, true), // TODO: remove test
        type: 'json',
        crossOrigin: true
    });

    var sheetReq = reqwest({
        url: sheetURL(sheetID, true), // TODO: remove test
        type: 'json',
        crossOrigin: true
    });

    docReq.then(doc => sheetReq.then(sheet => app(el, config, doc, sheet)));
}
