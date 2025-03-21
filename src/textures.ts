import {ImageDataType, ImageLoader} from '@loaders.gl/images';
import {load} from '@loaders.gl/core';


const sources = ["cog.png"];

const textureData = await Promise.all(sources.map(x => load(`textures/${x}`, ImageLoader, { image: {type: 'data'} }) as Promise<ImageDataType>));

const textures = textureData.reduce((acc, x, i) => (acc[removeExtension(sources[i])] = x, acc), <{ [key: string]: ImageDataType }>{});

console.log(textures);

export default textures;


function removeExtension(s: string) {
    const idx = s.lastIndexOf('.');
    if (idx < 0) return s;
    return s.substring(0, idx);
}