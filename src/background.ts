import textures from "./textures.js";
import { InstancedHexagons } from "./webgl/instanced-hexagons.js";



export function setup(canvas: HTMLCanvasElement) {

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");


    const effect = new InstancedHexagons(gl, 512);

    textures.load('textures/cog.png');
    

    function render() {
        effect.update();
        effect.render();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}









