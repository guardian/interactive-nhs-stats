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

    var xValues = chart.series
        .map(s => s.values.map(v => v.week))
        .reduce((a, b) => a.concat(b))
        .filter((v, i, t) => t.indexOf(v) === i)
        .sort((a, b) => a - b);
    var xMin = xValues[0], xMax = xValues[xValues.length - 1];

    var xRange = xMax - xMin;
    var yRange = chart.options.max - chart.options.min;

    function x(value) {
        return (value - xMin) / xRange * width;
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

        var xTicLabelGroup = svgEl(el, 'g', '', {'transform': `translate(0, ${height + 15})`});
        svgEl(xTicLabelGroup, 'text', 'nhs-chart__x-tic-label', {'x': x(xMin)}).textContent = 'December';
        svgEl(xTicLabelGroup, 'text', 'nhs-chart__x-tic-label', {'x': x(xMax)}).textContent = 'March';

        var yTicGroup = svgEl(el, 'g');
        var yTicLabelGroup = svgEl(el, 'g')
        range(chart.options.min, chart.options.max, chart.options.tic).forEach(yTic => {
            svgEl(yTicGroup, 'line', 'nhs-chart__y-tic', {'x1': 0, 'y1': y(yTic), 'x2': width, 'y2': y(yTic)});
            svgEl(yTicLabelGroup, 'text', 'nhs-chart__y-tic-label', {'x': -10, 'y': y(yTic)})
                .textContent = yTic.toLocaleString();
        });

        var seriesGroup = svgEl(el, 'g');
        chart.series.forEach((s, seriesNo) => {
            var d = 'M' + s.values.map(v => `${x(v.week)},${y(v.value)}`).join('L');
            svgEl(seriesGroup, 'path', 'nhs-chart__series', {'data-series': s.key, d});
        });
    }

    window.addEventListener('resize', throttle(render, 100));
    render();
}
