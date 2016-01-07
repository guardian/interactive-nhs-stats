import throttle from '../lib/throttle';
import range from '../lib/range';

const xmlns = 'http://www.w3.org/2000/svg';

function svgEl(parentEl, type, clazz='', attrs={}) {
    var el = document.createElementNS(xmlns, type);

    if (clazz) el.setAttributeNS(null, 'class', clazz);

    for (var attr in attrs) {
        el.setAttributeNS(null, attr, attrs[attr]);
    }

    parentEl.appendChild(el);
    return el;
}

export default function createChart(el, chart) {
    var width, height;

    var xRange = Math.max.apply(null, chart.series.map(s => s.values.length - 1));
    var yRange = chart.options.max - chart.options.min;

    function x(value) {
        return value / xRange * width;
    }

    function y(value) {
        return (1 - (value - chart.options.min) / yRange) * height;
    }

    function render() {
        var rect = el.getBoundingClientRect();
        if (rect.width === width && rect.height === height) return;
        width = rect.width;
        height = rect.height;

        el.innerHTML = '';

        var ticGroup = svgEl(el, 'g');
        range(chart.options.min, chart.options.max, chart.options.tic).forEach(tic => {
            svgEl(ticGroup, 'line', 'nhs-chart__tic', {'x1': 0, 'y1': y(tic), 'x2': width, 'y2': y(tic)});
        });

        var seriesGroup = svgEl(el, 'g');
        chart.series.forEach((s, seriesNo) => {
            var d = 'M' + s.values.map((v, t) => `${x(t)},${y(v.value)}`).join('L');
            svgEl(seriesGroup, 'path', 'nhs-chart__series', {'data-series': s.key, d});
        });
    }

    window.addEventListener('resize', throttle(render, 100));
    render();
}