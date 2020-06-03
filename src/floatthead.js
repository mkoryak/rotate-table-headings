/**
 * jQuery.floatThead adapter for rotate-table-headings.
 *
 * Import this script after jQuery.floatThead and jQuery.rotate-table-headings.
 * Run rotate-table-headings on a table first, followed by floatThead.
 *
 * Its kinda hacky since it requires you to never set the default options it overrides.
 */
 Object.assign(jQuery.rotateTableHeadings.defaults, {callback: ($table, lastCellWidth) => {
    // Ensure there is space for the last cell to extend into.
    // Do it as a fake cell to placate floatThead's needs.
    $table.find('tr').append(`<th aria-hidden='true' style='min-width: ${lastCellWidth.toFixed(2)}px; padding: 0; margin: 0;'></th>`);
 }});
 Object.assign(jQuery.floatThead.defaults, {floatContainerClass: 'rotate-table-headings-container'});