import insertStyles from './insert-styles';

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
export default function(
    tableCells,
    maxCellHeight,
    setLastCellWidth = true,
    angle = 45,
    textTruncateOffset = 10
){
    const solveRightTriangle = ({ hypotenuse, height }) => {
        const rads = (angle * Math.PI) / 180;
        if (hypotenuse) {
            // Solve for height.
            return hypotenuse * Math.sin(rads);
        } else {
            const width = height / Math.tan(rads);
            // Solve for hypotenuse.
            return Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
        }
    };

    const crel = (clazz, name = 'div') =>  {
        const el = document.createElement(name);
        el.classList.add(clazz);
        return el;
    };
    const empty = (el) => {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
        return el;
    };
    const findParentTable = (el) => {
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
    const compensateForCellBorder = (cellLabel) => {
         cellLabel.style.marginBottom = 
            `-${getComputedStyle(cellLabel).borderBottomWidth}`;
    };

    if(tableCells.length === 0){
        return 0;
    }

    // This method ensures that styles are inserted only once.
    insertStyles();

    const table = findParentTable(tableCells[0]);
    table.classList.add('rotate-table-headings');

    const maxHeadingWidth =
        solveRightTriangle({ height: maxCellHeight }) - textTruncateOffset;

    let maxWidth = -1;
    let lastCellWidth = 0;
    const cellLabels = [];

    for(const cell of tableCells){
        cell.style.whiteSpace = 'nowrap';
        const hypotenuse = cell.offsetWidth;
        const text = cell.innerText;
        const height = solveRightTriangle({hypotenuse});
        const idealHeight = Math.min(height, maxCellHeight);
        maxWidth = Math.max(hypotenuse, maxWidth);

        cell.style.height = idealHeight + 'px';
        cell.setAttribute('aria-label', text);
        const cellLabel = crel('cell-label');
        cellLabel.innerText = text;
        cellLabel.setAttribute('label', text);
        cellLabel.style.transform = `rotate(${360 - angle}deg)`;
        cellLabel.style.maxWidth = maxHeadingWidth + 'px';
        const positioner = crel('cell-positioner');
        positioner.appendChild(cellLabel);
        empty(cell).appendChild(positioner);
        cell.classList.add('cell-rotate');
        cellLabels.push(cellLabel);

        if(cell === tableCells[tableCells.length - 1]) {
            lastCellWidth = height / Math.tan(angle * Math.PI / 180);
        }
    }
    if(!setLastCellWidth) {
        const lastLabel = cellLabels.pop();
        compensateForCellBorder(lastLabel);
    }
    for(const cellLabel of cellLabels){
        cellLabel.style.width = maxWidth + 'px';
        compensateForCellBorder(cellLabel);
    }
    return lastCellWidth - textTruncateOffset;
};