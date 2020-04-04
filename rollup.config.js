import buble from '@rollup/plugin-buble';

export default {
    input: 'src/global.js',
    output: [{
        file: 'dist/rotate-table-headings-global.js',
        format: 'iife',
    }],
    compact: true,
    plugins: [buble({transforms: {
        dangerousForOf: true,
    }})]
};