import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import sass from 'rollup-plugin-sass';
import scss from 'rollup-plugin-scss';
import html from 'rollup-plugin-html';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import nodeResolve from "@rollup/plugin-node-resolve";

import fg from 'fast-glob';


export default {


    input: ['src/main.ts', 'src/main.scss', 'src/components.ts'],
    output: {
        dir: 'output',
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        
        html({ include: 'src/templates/**/*.html' }),
        webWorkerLoader(),
        nodeResolve({
            browser: true
        }),
        typescript({sourceMap: true, inlineSourceMap: true}),
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
            failOnError: false,
            
        }),
    ]

};