# rotate-table-headings
It rotates your table headings so that you can fit more stuff into the table.


WORK IN PROGRESS, based on this [code](https://codepen.io/mkoryak/pen/yLNVQVE) but better ;)

## Using with floatthead

The library comes with a jquery wrapper and an adapter that lets you run it alongside floatthead. 

Since this lib is not on a CDN, I am using relative import paths in this example that may not match yours.

```html
<script src="https://mkoryak.github.io/floatThead/dist/jquery.floatThead.js"></script>
<script src="/js/rotate-table-headings/jquery.rotate-table-headings.js"></script>

<!-- This import is the adapter and should be added after floatthead and rotate-table-headings. -->
<script src="/js/rotate-table-headings/jquery.rotate-table-headings.floatthead-adapter.js"></script>
```    

To use with floatthead, make sure you call rotate-table-headings **first**, then floatthead:

```js
$("table.demo").rotateTableHeadings({
    maxCellHeight: 200,
    angle: 45,
}).floatThead({
  scrollContainer: function($table) {
    return $table.closest(".table-container");
  },
  position: "absolute"
});
```

## Sponsored by [Ctrl O](https://ctrlo.com)

Ctrl O provides simple and innovative products to help an organization's business processes.
Linkspace, its flagship product, helps share information between teams and individuals, in a simple and effective manner.
