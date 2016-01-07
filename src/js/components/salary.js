const start = +new Date(2016, 0, 1);
const secsPerYear = 366 * 24 * 60 * 60;

export default function createSalary(el, salary) {
    var delta = (+new Date() - start) / 1000;
    el.textContent = Math.floor(salary / secsPerYear * delta).toLocaleString();
}
