import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import sass from 'rollup-plugin-sass';
import scss from 'rollup-plugin-scss';

import fg from 'fast-glob';


export default {
    input: ['src/portfolio.ts', 'src/main.scss'],
    output: {
        dir: 'output',
        format: 'esm',
    },
    plugins: [
        typescript(),
        json(),
        copy({
            targets: [
                { src: 'static/*', dest: 'output/' }
            ]
        }),
        {
            name: 'watch-external',
            async buildStart() {
                const files = await fg('static/**/*');
                for (let file of files) {
                    this.addWatchFile(file);
                }
            }
        },
        sass({
            output: "./output/css/style.css",
            failOnError: true,
        }),
    ],

};