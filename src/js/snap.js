import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import snapHTML from './text/snap.html!text'

const templateFn = doT.template(snapHTML);

function $$(el, s) {
    return [].slice.apply(el.querySelectorAll(s));
}


function app(el, config, doc, charts) {
    el.innerHTML = templateFn(doc.snap);

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));
}

window.init = function init(el, config) {
    loadData((doc, charts) => app(el, config, doc, charts));
}
