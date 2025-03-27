import {ImageDataType, ImageLoader} from '@loaders.gl/images';
import {load} from '@loaders.gl/core';

export class EventEmitter {


    listeners: { [key: string]: ((...args: any[]) => void)[] } = {};

    on(eventName: string, listener: (...args: any[]) => void) {
        this.listeners[eventName] ??= [];
        this.listeners[eventName].push(listener);
    }

    emit(eventName: string, ...args: any[]) {
        for (const l of this.listeners[eventName] || []) l(...args);
    }
}

export class TextureLoader extends EventEmitter {

    private cache: { [key: string]: ImageDataType } = {};

    async load(url: string, requestId?: any) {
        if (this.cache[url]) {
            this.emit('loaded', this.cache[url], requestId);
            return Promise.resolve(this.cache[url]);
        }
        return (load(url, ImageLoader, { image: {type: 'data'} }) as Promise<ImageDataType>).then(x => {
            this.cache[url] = x;
            this.emit('loaded', x, requestId);
            console.log(x);
            return x;
        })
    }
}

export default new TextureLoader();