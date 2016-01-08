import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import snapHTML from './text/snap.html!text'

const templateFn = doT.template(snapHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}


function app(el, config, doc, charts) {
    var sections = doc.snap.types
        .map(type => doc.sections.filter(s => s.type === type)[0])
        .filter(section => section);

    el.innerHTML = templateFn({sections});

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')], true));
}

window.init = function init(el, config) {
    loadData((doc, charts) => app(el, config, doc, charts));
}
