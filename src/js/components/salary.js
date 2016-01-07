const start = +new Date(2016, 0, 1);
const secsPerYear = 366 * 24 * 60 * 60;

var salaries = [];

function update() {
    var delta = (+new Date() - start) / 1000;
    salaries.forEach(s => {
        s.el.textContent = Math.floor(s.salary * delta).toLocaleString();
    });
}

setInterval(update, 5000);

export default function createSalary(el, salary) {
    salaries.push({el, 'salary': salary / secsPerYear});
    update();
}
