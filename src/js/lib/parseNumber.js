export default function parseNumber(s) {
    return parseFloat(s.replace(/[^0-9.]/g, ''));
}
