//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {

    const shader = gl.createShader(type)!;

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`An error occurred compiling the shaders: ${info}`);
    }

    return shader;
}


export function buildProgramInfo(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, vsSource: string, fsSource: string) {

    const info = <any>{
        program: shaderProgram,
        attribLocations: {},
        uniformLocations: {}
    };

    for (const x of vsSource.matchAll(/\s*attribute\s+[a-z0-9\[\]]+\s+([a-zA-Z0-9_)]+);/g)) {
        console.log(x[1], gl.getAttribLocation(shaderProgram, x[1]));
        info.attribLocations[x[1]] = gl.getAttribLocation(shaderProgram, x[1]);
    }

    for (const x of vsSource.matchAll(/\s*uniform\s+[a-z0-9\[\]]+\s+([a-zA-Z0-9_)]+);/g)) {
        info.uniformLocations[x[1]] = gl.getUniformLocation(shaderProgram, x[1]);
    }

    for (const x of fsSource.matchAll(/\s*uniform\s+[a-z0-9\[\]]+\s+([a-zA-Z0-9_)]+);/g)) {
        info.uniformLocations[x[1]] = gl.getUniformLocation(shaderProgram, x[1]);
    }

    console.log(info);
    return info;
}