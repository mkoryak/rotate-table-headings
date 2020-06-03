import buble from '@rollup/plugin-buble';

export default [{
    input: 'src/global.js',
    output: [{
        file: 'dist/rotate-table-headings.js',
        format: 'iife',
    }],
    compact: true,
    plugins: [buble({transforms: {
        dangerousForOf: true,
    }})]
},
{
    input: 'src/jquery.js',
    output: [{
        file: 'dist/jquery.rotate-table-headings.js',
        format: 'iife',
    }],
    compact: true,
    plugins: [buble({transforms: {
        dangerousForOf: true,
    }})]
},
{
    input: 'src/floatthead.js',
    output: [{
        file: 'dist/jquery.rotate-table-headings.floatthead-adapter.js',
        format: 'iife',
    }],
    compact: true,
    plugins: [buble({transforms: {
        dangerousForOf: true,
    }})]
}];