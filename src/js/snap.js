import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import snapHTML from './text/snap.html!text'

var templateFn = doT.template(snapHTML);
var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, config, doc, charts) {
    el.href = doc.furniture.shortURL;

    var sections = doc.snap.types
        .map(type => doc.sections.filter(s => s.type === type)[0])
        .filter(section => section);

    el.innerHTML = templateFn({sections});

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')], true));
}

window.init = (el, config) => loadData(app.bind(null, el, config));
