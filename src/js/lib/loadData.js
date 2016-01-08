import reqwest from 'reqwest'
import sheetURL from './sheetURL'
import groupBy from './groupBy'
import parseNumber from './parseNumber'

const docID = '1_z0hqi6kD1o9qmSl7xwvP__bIkaC060uIB2cv8eNS2Y';
const sheetID = '1D12VO4GvbCOHoD6_TNVcmtR2EU0JDxIfzb5ZuO6m-5k';

function last(array) {
    return array[array.length - 1];
}

export default function loadData(fn) {
    var docReq = reqwest({
        url: sheetURL(docID),
        type: 'json',
        crossOrigin: true
    });

    var sheetReq = reqwest({
        url: sheetURL(sheetID),
        type: 'json',
        crossOrigin: true
    });

    docReq.then(doc => {
    sheetReq.then(sheet => {
        var charts = {};
        sheet.sheets.charts.forEach(chart => {
            var stats = sheet.sheets.data
                .map(row => {
                    return {
                        'series': row.series,
                        'year': parseNumber(row.year),
                        'month': row.month,
                        'week': parseNumber(row.week),
                        'value': parseNumber(row[chart.type])
                    };
                })
                .filter(stat => !isNaN(stat.value));

            charts[chart.type] = {
                'series': groupBy(stats, 'series'),
                'options': {
                    'min': parseNumber(chart.min),
                    'max': parseNumber(chart.max),
                    'tic': parseNumber(chart.tic),
                    'threshold': parseNumber(chart.threshold),
                    'label': chart.label
                }
            };
        });

        doc.sections.forEach(section => {
            if (section.block === 'chart') {
                var series = charts[section.type].series;
                var latest = last(last(series).values);
                section.headline = section.headline.replace('{x}', latest.value.toLocaleString());
                section.series = series.filter(s => s.values.length > 0).map(s => s.key);
            }
        });


        fn(doc, charts);
    });
    });
}
