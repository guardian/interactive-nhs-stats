import doT from 'olado/doT'
import loadData from './lib/loadData'

import chart from './components/chart'

import embedHTML from './text/embed.html!text'

var templateFn = doT.template(embedHTML);

function app(el, config, doc, charts) {
    el.innerHTML = templateFn(doc);
}

window.init = (el, config) => loadData(app.bind(null, el, config));
