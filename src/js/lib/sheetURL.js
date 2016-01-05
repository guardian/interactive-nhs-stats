export default function sheetURL(sheetID, test=false) {
    var protocol = window.location.protocol.substring(0, 4) !== 'http' ? 'https://' : '//';
    return `${protocol}interactive.guim.co.uk/docsdata${test ? '-test': ''}/${sheetID}.json`;
}
