import { mat4, vec3 } from "gl-matrix";
import random from 'random';

import { buildProgramInfo, initShaderProgram, resizeCanvasToDisplaySize } from "./main.js";
import { Scene } from "./scene.js";


import textures from "../textures.js";
import { ImageDataType } from "@loaders.gl/images";




const uniform = random.uniform();

export class InstancedHexagons implements Scene {

    STRIDE = 17;
    HEX_RADIUS = 0.03;

    buf: Float32Array;

    ts: number;
    rotationSpeeds: number[];
    matrices: mat4[];
    mouseCoords = [0.0, 0.0];

    screenMatrix: mat4;

    shaderProgram: WebGLProgram;
    programInfo: any;
    buffers: any;

    canvas: HTMLCanvasElement;

    //ext: any;

    texture: WebGLTexture = -1;
    textureData: any;
    texWidth: number = 0;
    texHeight: number = 0;


    constructor(private gl: WebGL2RenderingContext, private nInstances: number) {

        //this.ext = gl.getExtension('ANGLE_instanced_arrays');
        //if (!this.ext) throw new Error('need ANGLE_instanced_arrays');

        this.screenMatrix = mat4.create();
        mat4.identity(this.screenMatrix);

        this.canvas = gl.canvas as HTMLCanvasElement;

        resizeCanvasToDisplaySize(this.canvas);

        if (this.canvas.clientWidth > this.canvas.clientHeight) mat4.fromScaling(this.screenMatrix, [1.0, this.canvas.clientWidth / this.canvas.clientHeight, 1.0]);
        else mat4.fromScaling(this.screenMatrix, [this.canvas.clientHeight / this.canvas.clientWidth, 1.0, 1.0]);

        window.addEventListener('resize', ev => {
            resizeCanvasToDisplaySize(this.canvas);
            if (this.canvas.clientWidth > this.canvas.clientHeight) mat4.fromScaling(this.screenMatrix, [1.0, this.canvas.clientWidth / this.canvas.clientHeight, 1.0]);
            else mat4.fromScaling(this.screenMatrix, [this.canvas.clientHeight / this.canvas.clientWidth, 1.0, 1.0]);
        });

        document.addEventListener('mousemove', ev => {
            this.mouseCoords[0] = ev.clientX / this.canvas.clientWidth * 2.0 - 1.0;
            this.mouseCoords[1] = -ev.clientY / this.canvas.clientHeight * 2.0 + 1.0;
        })

        //@ts-ignore
        textures.on('loaded', (t: ImageDataType) => {

            if (!this.gl.isTexture(this.texture)) return;

            this.texWidth = t.width;
            this.texHeight = t.height;
            this.textureData = t.data;


            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.textureData);

            console.log(this.texture);

        });

        this.buf = new Float32Array(nInstances * this.STRIDE);
        this.ts = Date.now();

        this.rotationSpeeds = Array.from({ length: nInstances }, (x, i) => Math.random() - 0.5);
        this.matrices = new Array(nInstances);


        const grid = createHexGrid(nInstances, this.HEX_RADIUS, 1.0);


        for (let i = 0; i < nInstances; ++i) {
            const m = mat4.create();
            mat4.identity(m);
            const baseScale = this.HEX_RADIUS * 2.0;
            const s = baseScale;// + Math.random() * baseScale * 0.2;// - baseScale * 0.15;
            const zoffset = Math.random();

            //const tr = randomPosition(0, 0);
            const tr = [grid[i][0] * 2.0 - 1.0, -grid[i][1] * 2.0 + 1.0];
            //console.log(tr);

            mat4.translate(m, m, [tr[0], tr[1], -zoffset]);

            const sm = zoffset * s * 0.2;

            mat4.scale(m, m, [s + sm, s + sm, s + sm]);

            this.buf.set(m, i * this.STRIDE);
            this.matrices[i] = m;

            const showTex = uniform() < 0.1 ? 1.0 : 0.0;
            this.buf.set([showTex], i * this.STRIDE + 16);
        }

        const vsSource = this.vs();
        const fsSource = this.fs();

        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        this.programInfo = buildProgramInfo(gl, this.shaderProgram, vsSource, fsSource);
        console.log(this.programInfo);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, createHexagonMesh(), gl.STATIC_DRAW);


        const matrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.buf, gl.DYNAMIC_DRAW);

        this.buffers = { position: positionBuffer, matrices: matrixBuffer };


        this.texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);


        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Prevents s-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // Prevents t-coordinate wrapping (repeating).
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.textureData);
    }

    update() {
        let now = Date.now();
        let deltat = now - this.ts;
        this.ts = now;

        for (let i = 0; i < this.nInstances; ++i) {
            const m = this.matrices[i];
            //mat4.rotateZ(m, m, deltat * this.rotationSpeeds[i] * 0.003);
            //this.buf.set(m, i * this.STRIDE);
        }
    }

    render() {

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things


        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        this.gl.useProgram(this.shaderProgram);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);


        this.gl.uniform2fv(this.programInfo.uniformLocations['mouseCoords'], this.mouseCoords);
        this.gl.uniformMatrix4fv(this.programInfo.uniformLocations['screenMatrix'], false, this.screenMatrix);
        this.gl.uniform1i(this.programInfo.uniformLocations['sampler'], 0);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,    // location
            3,                                                  // values to pull for each vertex
            this.gl.FLOAT,                                      // type
            false,                                              // normalize
            0,                                                  // stride (0=auto)
            0,                                                  // offset
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.matrices);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.buf);


        //mat4 takes 4 attribute locations

        for (let i = 0; i < 4; ++i) {
            const loc = this.programInfo.attribLocations['matrix'] + i;
            this.gl.enableVertexAttribArray(loc);

            const offset = i * 16;  // 4 floats per row, 4 bytes per float
            this.gl.vertexAttribPointer(
                loc,              // location
                4,                // values to pull for each vertex
                this.gl.FLOAT,    // type
                false,            // normalize
                this.STRIDE * 4,      // stride
                offset,           // offset
            );

            // this line says this attribute only changes for each 1 instance
            //this.ext.vertexAttribDivisorANGLE(loc, 1);
            this.gl.vertexAttribDivisor(loc, 1);
        }

        this.gl.enableVertexAttribArray(this.programInfo.attribLocations['showTex']);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations['showTex'], 1, this.gl.FLOAT, false, this.STRIDE * 4, 64);
        //this.ext.vertexAttribDivisorANGLE(this.programInfo.attribLocations['showTex'], 1);
        this.gl.vertexAttribDivisor(this.programInfo.attribLocations['showTex'], 1);

        {
            const vertexCount = 8;
            //this.ext.drawArraysInstancedANGLE(
            this.gl.drawArraysInstanced(
                this.gl.TRIANGLE_FAN,
                0,             // offset
                vertexCount,   // num vertices per instance
                this.nInstances,  // num instances
            );

            //this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertexCount);
        }

    }


    vs() {
        return `
        attribute vec4 aVertexPosition;
        attribute mat4 matrix;
        attribute float showTex;

        varying float illumination;
        varying float elevation;
        varying float vr;
        varying vec2 uv;
        varying float texMask;

        uniform vec2 mouseCoords;
        uniform mat4 screenMatrix;

        

        float map(float value, float inMin, float inMax, float outMin, float outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }

        void main() {
            gl_Position = screenMatrix * matrix * aVertexPosition;
            float d = distance(mouseCoords, gl_Position.xy) * 0.5;
            elevation = -matrix[3][2];
            vec2 center = (screenMatrix * matrix * vec4(0.0, 0.0, 0.0, 1.0)).xy;
            float dval = 1.0 - pow(distance(mouseCoords, center) * 0.5, 0.5);
            illumination = dval;
            vr = length(aVertexPosition.xyz);
            uv = aVertexPosition.xy * 0.5 + 0.5;
            texMask = showTex; 
        }
        `;
    }

    fs() {
        return `
        precision mediump float;

        uniform sampler2D sampler;

        varying float illumination;
        varying float elevation;
        varying float vr;

        varying vec2 uv;

        varying float texMask;

        float map(float value, float inMin, float inMax, float outMin, float outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }

        void main() {

            vec4 t = texture2D(sampler, uv) * texMask;
            vec4 i = vec4(vec3(elevation * illumination), 1.0);
            vec4 highlight = vec4(0.0, 1.0, 1.0, 1.0) * clamp(map(vr, 0.8, 1.0, 0.0, 1.0), 0.0, 1.0);
            vec4 albedo = t * i;
            gl_FragColor = max(highlight, albedo);
        }
        `;
    }
}

export function createHexagonMesh() {

    const arr = new Float32Array(8 * 3);

    const center = vec3.fromValues(0, 0, 0);
    arr.set(center);

    const arrow = vec3.fromValues(1, 0, 0);
    for (let i = 0; i < 6; i++) {
        let v = vec3.create();
        vec3.rotateZ(v, arrow, center, Math.PI / 3.0 * i);
        arr.set(v, i * 3 + 3);
    }

    arr.set(arrow, 7 * 3);

    return arr;
}

function randomPosition(i: number, j: number) {
    return [Math.random() * 2 - 1, Math.random() * 2 - 1];
}

function gridPosition(i: number, j: number, itemsPerRow: number, total: number) {
    const x = (2.0 / (itemsPerRow - 1) * j) - 1.0;
    const y = (2.0 / (Math.ceil(total / itemsPerRow) - 1) * i) - 1.0;
    return [x, y];
}


function createHexGrid(items: number, r: number, width: number) {

    const result = [];

    let gw = 1.5 * r;
    let perRow = Math.ceil(width / gw) + 1;

    let gh = Math.sqrt(3) * 0.5 * r;

    for (let k = 0; k < items; k++) {

        let i = ~~(k / perRow);
        let j = k % perRow;

        result.push([j * gw, (i * 2 - (j % 2)) * gh]);
    }

    return result;
}

//console.log(createHexGrid(100, 10, 100));

