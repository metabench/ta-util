
class Tensor {
    constructor(data, shape, strides = null, offset = 0) {
        this.data = data;
        this.shape = shape;
        this.offset = offset;

        if (strides) {
            this.strides = strides;
        } else {
            this.strides = Tensor.calculateStrides(shape);
        }
        this._isContiguous = this._checkContiguity();
    }

    _checkContiguity() {
        let expectedStride = 1;
        for (let i = this.shape.length - 1; i >= 0; i--) {
            if (this.shape[i] > 1 && this.strides[i] !== expectedStride) {
                return false;
            }
            expectedStride *= this.shape[i];
        }
        return true;
    }

    get isContiguous() {
        return this._isContiguous;
    }

    static calculateStrides(shape) {
        const ndim = shape.length;
        const strides = new Array(ndim);
        let stride = 1;
        for (let i = ndim - 1; i >= 0; i--) {
            strides[i] = stride;
            stride *= shape[i];
        }
        return strides;
    }

    get(...indices) {
        let index = this.offset;
        for (let i = 0; i < indices.length; i++) {
            index += indices[i] * this.strides[i];
        }
        return this.data[index];
    }

    set(value, ...indices) {
        let index = this.offset;
        for (let i = 0; i < indices.length; i++) {
            index += indices[i] * this.strides[i];
        }
        this.data[index] = value;
    }

    reshape(newShape) {
        const currentSize = this.shape.reduce((a, b) => a * b, 1);
        const newSize = newShape.reduce((a, b) => a * b, 1);
        if (currentSize !== newSize) {
            throw new Error(`Cannot reshape tensor of size ${currentSize} to shape ${newShape}`);
        }

        if (!this.isContiguous) {
            throw new Error('Reshape is currently only supported for contiguous tensors. Call .clone() (not implemented) or ensure the tensor is contiguous.');
        }

        return new Tensor(this.data, newShape, null, this.offset);
    }

    transpose(...axes) {
        if (axes.length === 0) {
            axes = Array.from({ length: this.shape.length }, (_, i) => i).reverse();
        }
        const newShape = axes.map(i => this.shape[i]);
        const newStrides = axes.map(i => this.strides[i]);
        return new Tensor(this.data, newShape, newStrides, this.offset);
    }

    get size() {
        return this.shape.reduce((a, b) => a * b, 1);
    }

    get ndim() {
        return this.shape.length;
    }

    add(other) {
        return require('./tensor-ops').add(this, other);
    }
    sub(other) {
        return require('./tensor-ops').sub(this, other);
    }
    mul(other) {
        return require('./tensor-ops').mul(this, other);
    }
    div(other) {
        return require('./tensor-ops').div(this, other);
    }
}

module.exports = Tensor;
