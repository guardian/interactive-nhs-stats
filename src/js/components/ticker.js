const start = +new Date(2016, 0, 1);
const secsPerYear = 366 * 24 * 60 * 60;

export default function createTicker(el, yearTotal) {
    var delta = (+new Date() - start) / 1000;
    el.textContent = Math.floor(yearTotal / secsPerYear * delta).toLocaleString();
}
