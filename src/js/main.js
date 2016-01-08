import doT from 'olado/doT'
import share from './lib/share'
import loadData from './lib/loadData'
import parseNumber from './lib/parseNumber'

import chart from './components/chart'
import ticker from './components/ticker'

import mainHTML from './text/main.html!text'

var templateFn = doT.template(mainHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}

function app(el, config, doc, charts) {
    var shareFn = share(doc.furniture.headline, doc.furniture.shortURL, doc.furniture.hashtag);

    el.innerHTML = templateFn(doc);

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));
    $$(el, '.js-ticker').forEach(tickerEl => ticker(tickerEl, parseNumber(tickerEl.getAttribute('data-ticker'))));

    $$(el, '.interactive-share').forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}

export function init(el, context, config, mediator) {
    loadData((doc, charts) => app(el, config, doc, charts));
}
