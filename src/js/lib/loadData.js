import reqwest from 'reqwest'
import sheetURL from './sheetURL'

const docID = '1_z0hqi6kD1o9qmSl7xwvP__bIkaC060uIB2cv8eNS2Y';
const sheetID = '1D12VO4GvbCOHoD6_TNVcmtR2EU0JDxIfzb5ZuO6m-5k';

export default function loadData(fn) {
    var docReq = reqwest({
        url: sheetURL(docID, true), // TODO: remove test
        type: 'json',
        crossOrigin: true
    });

    var sheetReq = reqwest({
        url: sheetURL(sheetID, true), // TODO: remove test
        type: 'json',
        crossOrigin: true
    });

    docReq.then(doc => sheetReq.then(sheet => fn(doc, sheet)));
}
