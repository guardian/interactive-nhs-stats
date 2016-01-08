export default function parseNumber(s) {
    return parseFloat(s.replace(/,/g, ''));
}
