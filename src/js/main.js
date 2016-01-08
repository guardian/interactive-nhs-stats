import doT from 'olado/doT'
import share from './lib/share'
import loadData from './lib/loadData'
import parseNumber from './lib/parseNumber'

import chart from './components/chart'
import salary from './components/salary'

import mainHTML from './text/main.html!text'

var templateFn = doT.template(mainHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}

function last(array) {
    return array[array.length - 1];
}

function app(el, config, doc, charts) {
    var shareFn = share(doc.furniture.headline, doc.furniture.shortURL, doc.furniture.hashtag);

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
    loadData((doc, charts) => app(el, config, doc, charts));
}
