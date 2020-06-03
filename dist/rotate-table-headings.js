(function () {
    'use strict';

    /**
     * Inserts styles that are required by this library into the DOM.
     */
    function insertStyles () {
        var STYLE_ID = 'rotate-table-headings-style';

        if (document.getElementById(STYLE_ID)) {
            return;
        }

        var styleElem = document.createElement('style');
        styleElem.type = 'text/css';
        styleElem.id = STYLE_ID;
        document.head.appendChild(styleElem);
        var sheet = styleElem.sheet;

        var stringify = function (selector, rules) {
            return (selector + " {\n" + (Object.keys(rules)
                    .map(function (key) { return ((key.split(/(?=[A-Z])/).join('-').toLowerCase()) + ": " + (rules[key]) + ";"); }).join('\n')) + "\n}");
        };

        var add = function (selector, rules) {
            sheet.insertRule(stringify(selector, rules),
                sheet.cssRules.length);
        };

        add(".rotate-table-headings-container", {
            overflowY: 'hidden',
        });
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

    /**
     * Rotates the contents of table cells by `angle` while also
     * truncating their contents if it does not fit inside the max
     * cell height.
     *
     * @param {!NodeList<Element>} tableCells NodeList of table cells: TDs
     *   or THs to operate on.
     * @param {number} maxCellHeight Maximum height of the cell in pixels.
     *   Used for truncating the cell contents to fit. Use a very large
     *   number if you do not want to truncate cell text.
     * @param {boolean=} setLastCellWidth Whether to set the last cell's 
     *   width so that the header extends outside the table. 
     * @param {number=} angle Angle in degrees.
     * @param {number=} textTruncateOffset Subtract this from the max width
     *   used to truncate cell text. It is needed because our forumula does
     *   not take font-size into account.
     *
     * @return {number} The horizontal width of the last cell's label. Since
     *   this cell will extend outside of the table, you will need this value
     *   to add padding to the table if the label goes off-screen.
     */
    function rotateTableHeadings(
        tableCells,
        maxCellHeight,
        setLastCellWidth,
        angle,
        textTruncateOffset
    ){
        if ( setLastCellWidth === void 0 ) setLastCellWidth = true;
        if ( angle === void 0 ) angle = 45;
        if ( textTruncateOffset === void 0 ) textTruncateOffset = 10;

        var solveRightTriangle = function (ref) {
            var hypotenuse = ref.hypotenuse;
            var height = ref.height;

            var rads = (angle * Math.PI) / 180;
            if (hypotenuse) {
                // Solve for height.
                return hypotenuse * Math.sin(rads);
            } else {
                var width = height / Math.tan(rads);
                // Solve for hypotenuse.
                return Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
            }
        };

        var crel = function (clazz, name) {
            if ( name === void 0 ) name = 'div';

            var el = document.createElement(name);
            el.classList.add(clazz);
            return el;
        };
        var empty = function (el) {
            while(el.firstChild) {
                el.removeChild(el.firstChild);
            }
            return el;
        };
        var findParentTable = function (el) {
            while (el) {
                if (el.nodeName === 'TABLE') {
                    return el;
                } else {
                    el = el.parentElement;
                }
            }
        };

        // Push the cell down to line the border up with the columns.
        // Equal to border-bottom-width.
        var compensateForCellBorder = function (cellLabel) {
             cellLabel.style.marginBottom = 
                "-" + (getComputedStyle(cellLabel).borderBottomWidth);
        };

        if(tableCells.length === 0){
            return 0;
        }

        // This method ensures that styles are inserted only once.
        insertStyles();

        var table = findParentTable(tableCells[0]);
        table.classList.add('rotate-table-headings');

        var maxHeadingWidth =
            solveRightTriangle({ height: maxCellHeight }) - textTruncateOffset;

        var maxWidth = -1;
        var lastCellWidth = 0;
        var cellLabels = [];

        for(var i = 0, list = tableCells; i < list.length; i += 1){
            var cell = list[i];

            cell.style.whiteSpace = 'nowrap';
            var hypotenuse = cell.offsetWidth;
            var text = cell.innerText;
            var height = solveRightTriangle({hypotenuse: hypotenuse});
            var idealHeight = Math.min(height, maxCellHeight);
            maxWidth = Math.max(hypotenuse, maxWidth);

            cell.style.height = idealHeight + 'px';
            cell.setAttribute('aria-label', text);
            var cellLabel = crel('cell-label');
            cellLabel.innerText = text;
            cellLabel.setAttribute('label', text);
            cellLabel.style.transform = "rotate(" + (360 - angle) + "deg)";
            cellLabel.style.maxWidth = maxHeadingWidth + 'px';
            var positioner = crel('cell-positioner');
            positioner.appendChild(cellLabel);
            empty(cell).appendChild(positioner);
            cell.classList.add('cell-rotate');
            cellLabels.push(cellLabel);

            if(cell === tableCells[tableCells.length - 1]) {
                lastCellWidth = height / Math.tan(angle * Math.PI / 180);
            }
        }
        if(!setLastCellWidth) {
            var lastLabel = cellLabels.pop();
            compensateForCellBorder(lastLabel);
        }
        for(var i$1 = 0, list$1 = cellLabels; i$1 < list$1.length; i$1 += 1){
            var cellLabel$1 = list$1[i$1];

            cellLabel$1.style.width = maxWidth + 'px';
            compensateForCellBorder(cellLabel$1);
        }
        return lastCellWidth - textTruncateOffset;
    }

    // Rollup entry point to generate an IIFE with a global on window.
    window.rotateTableHeadings = rotateTableHeadings;

}());
