export default function tLS(n) {
    var s = n.toLocaleString();
    if (n % 1 === 0) { // IE9 fix
        s = s.replace(/[^0-9]00$/, '');
    }
    return s;
}
