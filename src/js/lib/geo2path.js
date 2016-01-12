var flatten = arrays => Array.prototype.concat.apply([], arrays);

function polygon(coordinates) {
    return 'M' + coordinates.map(set => set.map(point => `${point[0]},${point[1]}`).join('L')).join('M') + 'Z';
}

const objects = {
    'Polygon': geometry => [polygon(geometry.coordinates)],
    'MultiPolygon': geometry => flatten(geometry.coordinates.map(polygon)),
    'Feature': feature => { return {'id': feature.id, 'paths': geo2path(feature.geometry)}; },
    'FeatureCollection': collection => collection.features.map(geo2path)
};

export default function geo2path(obj) {
    return objects[obj.type](obj);
}
