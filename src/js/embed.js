import iframeMessenger from 'guardian/iframe-messenger'
import doT from 'olado/doT'
import loadData from './lib/loadData'
import parseNumber from './lib/parseNumber'

import chart from './components/chart'
import ticker from './components/ticker'

import embedHTML from './text/embed.html!text'

var templateFn = doT.template(embedHTML);
var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));

function app(el, config, doc, charts) {
    var parts = window.location.search.substr(1).split('&');
    var type = parts[0];
    var section = doc.sections.filter(s => s.type === type)[0];
    if (type === 'salaries') {
        let jobId = parts[1];
        section.job = section.jobs.filter(job => job.id === jobId)[0];
        section.headline = section.embedheadline.replace('{title}', section.job.embedtitle);
    }
    el.innerHTML = templateFn({section, 'shortURL': doc.furniture.shortURL});

    $$(el, '.js-chart').forEach(chartEl => chart(chartEl, charts[chartEl.getAttribute('data-type')]));
    $$(el, '.js-ticker').forEach(tickerEl => ticker(tickerEl, parseNumber(tickerEl.getAttribute('data-ticker'))));

    iframeMessenger.enableAutoResize();
}

window.init = (el, config) => loadData(app.bind(null, el, config));
