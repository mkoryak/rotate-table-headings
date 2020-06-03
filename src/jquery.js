import rotateTableHeadings from './rotate-table-headings';

/**
 * JQuery wrapper for rotateTableHeadings.
 * You may run this plugin on a table wrapped set or a header cell 
 * wrapped set. ex:
 * $('table.rotated').rotateTableHeadings();
 * $('table tr.rotated > th').rotateTableHeadings();
 *
 * The options object has:
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
 * @param {string=} cellSelector If you run this plugin on a table, this
 *	 selector will be used to find the table cells to rotate.
 * @param {function($table: jQuery, lastCellWidth: number): jQuery} callback
 *   A function executed after the plugin runs giving you access to the 
 *   table and the lastCellWidth.
 */   
jQuery.fn.rotateTableHeadings = function(options = {}) {
	const opts = Object.assign(jQuery.rotateTableHeadings.defaults, options);
	const $this = this;

	const wrapper = ($cells) => {
		$cells = $cells.filter('th,td');
		const lastCellWidth = rotateTableHeadings(
            $cells.toArray(),
            opts.maxCellHeight,
            opts.setLastCellWidth,
            opts.angle,
            opts.textTruncateOffset,
        );
        opts.callback($cells.closest('table'), lastCellWidth);
	};
	
	if($this.length && $this[0].nodeName === 'TABLE') {
		// Assume that this is a list of tables.
		$this.each(function(){
			wrapper($this.find(opts.cellSelector));
		});
	} else {
		wrapper($this);
	}
	// This is required for making jQuery plugin calls chainable.
	return $this;
};
jQuery.rotateTableHeadings = {
	defaults: {
		maxCellHeight: 5000,
		setLastCellWidth: true,
		angle: 45,
		textTruncateOffset: 10,
		cellSelector: '> thead th',
		callback: ($table, lastCellWidth) => {},
	}
}