import iframeMessenger from 'guardian/iframe-messenger'
import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import embedHTML from './text/embed.html!text'

var templateFn = doT.template(embedHTML);
var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, config, doc, charts) {
    var type = window.location.search.substr(1);
    var section = doc.sections.filter(s => s.type === type)[0];
    el.innerHTML = templateFn({section, 'shortURL': doc.furniture.shortURL});

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));

    iframeMessenger.enableAutoResize();
}

window.init = (el, config) => loadData(app.bind(null, el, config));
