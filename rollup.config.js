import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import watchGlobs from 'rollup-plugin-watch-globs';

import fg from 'fast-glob';


export default {
    input: ['src/portfolio.ts'],
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
            async buildStart(){
                const files = await fg('static/**/*');
                for(let file of files){
                    this.addWatchFile(file);
                }
            }
        }
    ],

};