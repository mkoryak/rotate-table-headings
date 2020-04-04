/**
 * Inserts styles that are required by this library into the DOM.
 */
export default function () {
    const STYLE_ID = 'rotate-table-headings-style';

    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.id = STYLE_ID;
    document.head.appendChild(styleElem);
    const sheet = styleElem.sheet;

    const stringify = (selector, rules) => {
        return `${ selector } {\n${
            Object.keys(rules)
                .map(key => `${key.split(/(?=[A-Z])/).join('-').toLowerCase()}: ${ rules[key] };`).join('\n')
            }\n}`;
    };

    const add = (selector, rules) => {
        sheet.insertRule(stringify(selector, rules),
            sheet.cssRules.length);
    };

    add("table.rotate-table-headings", {
        borderCollapse: 'collapse',
        borderSpacing: '0',
    });
    add("table.rotate-table-headings .cell-rotate", {
        verticalAlign: 'bottom',
        padding: '0 !important',
        textAlign: 'left',
    });
    add("table.rotate-table-headings .cell-rotate .cell-positioner", {
        position: 'relative',
    });
    add("table.rotate-table-headings .cell-rotate .cell-label", {
        position: 'absolute',
        bottom: '0',
        textAlign: 'left',
        left: '100%',
        transformOrigin: 'bottom left',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    });
}