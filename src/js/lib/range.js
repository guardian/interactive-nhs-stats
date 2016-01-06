export default function range(min, max, step=1) {
    var ret = [];
    for (var v = min; v <= max; v += step) {
        ret.push(v);
    }
    return ret;
}
