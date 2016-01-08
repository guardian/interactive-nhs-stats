import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import snapHTML from './text/snap.html!text'

const templateFn = doT.template(snapHTML);

function app(el, config, doc, sheet) {
    el.innerHTML = templateFn(doc.snap);
}

window.init = function init(el, config) {
    loadData((doc, sheet) => app(el, config, doc, sheet));
}
