import doT from 'olado/doT'
import share from './lib/share'
import loadData from './lib/loadData'
import parseNumber from './lib/parseNumber'
import tLS from './lib/tLS'

import chart from './components/chart'
import ticker from './components/ticker'

import mainHTML from './text/main.html!text'

var templateFn = doT.template(mainHTML);
var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, config, doc, charts, flu) {
    var shareFn = share(doc.furniture.headline, doc.furniture.shortURL, doc.furniture.hashtag);

    el.innerHTML = templateFn(doc);

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));
    $$(el, '.js-ticker').forEach(tickerEl => ticker(tickerEl, parseNumber(tickerEl.getAttribute('data-ticker'))));
    $$(el, '.js-map').forEach(mapEl => map(mapEl, flu));

    $$(el, '.interactive-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click', () => shareFn(network));
    });
}

export function init(el, context, config, mediator) {
    loadData(app.bind(null, el, config));
}
