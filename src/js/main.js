import doT from 'olado/doT'
import share from './lib/share'
import loadData from './lib/loadData'
import groupBy from './lib/groupBy'

import chart from './components/chart'
import salary from './components/salary'

import mainHTML from './text/main.html!text'

var templateFn = doT.template(mainHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}

function parseNumber(s) {
    return parseFloat(s.replace(/,/g, ''));
}

function last(array) {
    return array[array.length - 1];
}

function app(el, config, doc, sheet) {
    var shareFn = share(doc.furniture.headline, doc.furniture.shortURL, doc.furniture.hashtag);

    var charts = {};
    sheet.sheets.charts.forEach(chart => {
        var stats = sheet.sheets.data
            .map(row => {
                return {
                    'series': row.series,
                    'year': parseNumber(row.year),
                    'month': row.month,
                    'week': parseNumber(row.week),
                    'value': parseNumber(row[chart.type])
                };
            })
            .filter(stat => !isNaN(stat.value));

        charts[chart.type] = {
            'series': groupBy(stats, 'series'),
            'options': {
                'min': parseNumber(chart.min),
                'max': parseNumber(chart.max),
                'tic': parseNumber(chart.tic)
            }
        };
    });

    doc.sections.forEach(section => {
        if (section.block === 'chart') {
            var series = charts[section.type].series;
            var latest = last(last(series).values);
            section.headline = section.headline.replace('{x}', latest.value.toLocaleString());
            section.series = series.filter(s => s.values.length > 0).map(s => s.key);
        }
    });

    el.innerHTML = templateFn(doc);

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));
    $$(el, '.js-salary').forEach(salaryEl => salary(salaryEl, parseNumber(salaryEl.getAttribute('data-salary'))));

    $$(el, '.interactive-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}

export function init(el, context, config, mediator) {
    loadData((doc, sheet) => app(el, config, doc, sheet));
}
