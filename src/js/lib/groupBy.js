export default function groupBy(array, key) {
    var ret = {};
    array.forEach(arr => {
        if (!ret[arr[key]]) ret[arr[key]] = [];
        ret[arr[key]].push(arr);
    });
    return Object.keys(ret).map(key => { return {key, value: ret[key]}; });
}
