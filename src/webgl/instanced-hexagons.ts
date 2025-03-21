import { mat4 } from "gl-matrix";

export class InstancedHexagons {

    STRIDE = 16;

    buf: Float32Array;

    ts: number;
    rotationSpeeds: number[];
    matrices: mat4[];

    constructor(private nInstances: number) {
        this.buf = new Float32Array(nInstances * this.STRIDE);
        this.ts = Date.now();

        this.rotationSpeeds = Array.from({ length: nInstances }, (x, i) => Math.random() - 0.5);
        this.matrices = new Array(nInstances);

        for (let i = 0; i < nInstances; ++i) {
            const m = mat4.create();
            mat4.identity(m);
            const s = Math.random() * 0.1;
            mat4.translate(m, m, [Math.random() * 2 - 1, Math.random() * 2 - 1, 0]);
            mat4.scale(m, m, [s, s, s]);

            this.buf.set(m, i * this.STRIDE);
            this.matrices[i] = m;
        }

        console.log(this.rotationSpeeds);
    }

    update() {
        let now = Date.now();
        let deltat = now - this.ts;
        this.ts = now;

        for (let i = 0; i < this.nInstances; ++i) {
            const m = this.matrices[i];
            mat4.rotateZ(m, m, deltat * this.rotationSpeeds[i] * 0.01);
            this.buf.set(m, i * this.STRIDE);
        }
    }


}