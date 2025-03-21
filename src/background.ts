import { mat4, vec3 } from "gl-matrix";
import { buildProgramInfo, initShaderProgram } from "./webgl/main.js";
import { InstancedHexagons } from "./webgl/instanced-hexagons.js";


const vsSource = `
    attribute vec4 aVertexPosition;
    attribute mat4 matrix;
    void main() {
      gl_Position = matrix * aVertexPosition;
      //gl_Position = aVertexPosition;
    }
  `;

const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;


const nInstances = 16;


const effect = new InstancedHexagons(nInstances);

export function setup(canvas: HTMLCanvasElement) {

    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

    const ext = gl.getExtension('ANGLE_instanced_arrays');
    if (!ext) throw new Error('need ANGLE_instanced_arrays');


    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = buildProgramInfo(gl, shaderProgram, vsSource, fsSource);

    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, createHexagonMesh(), gl.STATIC_DRAW);


    const matrixBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    // just allocate the buffer
    gl.bufferData(gl.ARRAY_BUFFER, createInstanceDataBuffers(nInstances), gl.DYNAMIC_DRAW);

    const buffers = { position: positionBuffer, matrices: matrixBuffer };

    render(gl, ext, programInfo, buffers);
}



export function render(gl: WebGLRenderingContext, ext: any, programInfo: any, buffers: any) {

    gl.clearColor(1.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    const numComponents = 3; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.matrices);
    const bytesPerMatrix = 4 * 16;
    for (let i = 0; i < 4; ++i) {
        const loc = programInfo.attribLocations['matrix'] + i;
        gl.enableVertexAttribArray(loc);
        // note the stride and offset
        const offset = i * 16;  // 4 floats per row, 4 bytes per float
        gl.vertexAttribPointer(
            loc,              // location
            4,                // size (num values to pull from buffer per iteration)
            gl.FLOAT,         // type of data in buffer
            false,            // normalize
            bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
            offset,           // offset in buffer
        );
        // this line says this attribute only changes for each 1 instance
        //@ts-ignore
        ext.vertexAttribDivisorANGLE(loc, 1);
    }

    {
        const vertexCount = 8;
        ext.drawArraysInstancedANGLE(
            gl.TRIANGLE_FAN,
            0,             // offset
            vertexCount,   // num vertices per instance
            nInstances,  // num instances
        );

        //gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
    }



    //console.log(gl.getError());

    requestAnimationFrame(() => render(gl, ext, programInfo, buffers));

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

function createInstanceDataBuffers(n: number) {

    const stride = (
        16 + // MVP matrix
        0
    );

    const buf = new Float32Array(n * stride);

    for (let i = 0; i < n; ++i) {
        const m = mat4.create();
        mat4.identity(m);
        const s = Math.random() * 0.1;
        mat4.translate(m, m, [Math.random() * 2 - 1, Math.random() * 2 - 1, 0]);
        mat4.scale(m, m, [s, s, s]);

        buf.set(m, i * stride);
    }

    console.log(buf);

    return buf;
}

