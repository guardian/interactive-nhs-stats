import topojson from 'mbostock/topojson'
import geo2path from '../lib/geo2path'
import svgEl from '../lib/svgEl'

import topo from '../data/topo.json!json'

var geo = topojson.feature(topo, topo.objects.CTYUA_DEC_2012_EW_BFE);
var paths = geo2path(geo);

const colors = ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'].reverse();

export default function createMap(el, data) {
    var areaEls = {};
    paths.forEach(path => {
        var flu = data[path.id];
        var clazz = 'nhs-map__area';
        var color = '';
        if (!flu || isNaN(flu.rate)) {
            clazz += ' is-no-data';
        } else {
            let colorI = 0;
            if (flu.rate >= 15.4) colorI++;
            if (flu.rate >= 27) colorI++;
            if (flu.rate >= 75.8) colorI++;
            color = colors[colorI];
            console.log(colorI, color, flu.rate);
        }

        areaEls[path.id] = path.paths.map(path => {
            return svgEl(el , 'path', clazz, {'d': path, 'fill': color})
        });
    });

    // TODO: fix missing places
    console.log(Object.keys(data).map(code => [code, areaEls[code]]).filter(s => !s[1]));
}

