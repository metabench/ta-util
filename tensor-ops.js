
const Tensor = require('./tensor');

const broadcastShapes = (s1, s2) => {
    const ndim = Math.max(s1.length, s2.length);
    const res = new Array(ndim);
    for (let i = 0; i < ndim; i++) {
        const d1 = s1[s1.length - 1 - i] || 1;
        const d2 = s2[s2.length - 1 - i] || 1;
        if (d1 !== d2 && d1 !== 1 && d2 !== 1) {
            throw new Error(`Incompatible shapes for broadcasting: ${s1} and ${s2}`);
        }
        res[ndim - 1 - i] = Math.max(d1, d2);
    }
    return res;
};

const getBroadcastIndices = (indices, shape) => {
    const res = new Array(shape.length);
    const diff = indices.length - shape.length;
    for (let i = 0; i < shape.length; i++) {
        res[i] = shape[i] === 1 ? 0 : indices[i + diff];
    }
    return res;
};

const op = (t1, t2, operation) => {
    const outShape = broadcastShapes(t1.shape, t2.shape);
    const outSize = outShape.reduce((a, b) => a * b, 1);
    const outData = new t1.data.constructor(outSize);
    const out = new Tensor(outData, outShape);

    if (t1.isContiguous && t2.isContiguous && JSON.stringify(t1.shape) === JSON.stringify(t2.shape)) {
        const d1 = t1.data;
        const d2 = t2.data;
        const o1 = t1.offset;
        const o2 = t2.offset;
        for (let i = 0; i < outSize; i++) {
            outData[i] = operation(d1[o1 + i], d2[o2 + i]);
        }
        return out;
    }

    const ndim = outShape.length;
    const currentIdx = new Array(ndim).fill(0);

    for (let i = 0; i < outSize; i++) {
        const v1 = t1.get(...getBroadcastIndices(currentIdx, t1.shape));
        const v2 = t2.get(...getBroadcastIndices(currentIdx, t2.shape));
        outData[i] = operation(v1, v2);

        for (let j = ndim - 1; j >= 0; j--) {
            currentIdx[j]++;
            if (currentIdx[j] < outShape[j]) break;
            currentIdx[j] = 0;
        }
    }
    return out;
};

const add = (t1, t2) => op(t1, t2, (a, b) => a + b);
const sub = (t1, t2) => op(t1, t2, (a, b) => a - b);
const mul = (t1, t2) => op(t1, t2, (a, b) => a * b);
const div = (t1, t2) => op(t1, t2, (a, b) => a / b);

module.exports = { add, sub, mul, div };
