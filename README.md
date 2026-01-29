# ta-util

Utilities for JavaScript Typed Arrays and a versatile Tensor library for AI-agent-friendly tensor manipulations.

## Installation

```bash
npm install ta-util
```

## Tensor API

The `Tensor` class provides a high-performance, multi-dimensional array interface on top of Typed Arrays.

### `new Tensor(data, shape, [strides], [offset])`

* `data`: A Typed Array (e.g., `Float32Array`).
* `shape`: An array of integers representing the dimensions.
* `strides`: (Optional) Custom strides for indexing.
* `offset`: (Optional) Starting offset in the data.

### Methods

* `get(...indices)`: Returns the value at the specified indices.
* `set(value, ...indices)`: Sets the value at the specified indices.
* `reshape(newShape)`: Returns a new Tensor view with the specified shape. **Currently only supported for contiguous tensors.**
* `transpose(...axes)`: Returns a new Tensor view with axes reordered.
* `add(other)`, `sub(other)`, `mul(other)`, `div(other)`: Perform element-wise operations with **broadcasting support**.

### Properties

* `shape`: The dimensions of the tensor.
* `ndim`: Number of dimensions.
* `size`: Total number of elements.
* `isContiguous`: Boolean indicating if the data is laid out contiguously in memory.

## Typed Array Utilities

### `ta_concat(arr_of_tas)`

Optimized concatenation of Typed Arrays using `TypedArray.prototype.set`.

### `nta_deduplicate_sorted_ta(ta)`

Returns a new Typed Array with duplicate values removed. **Requires sorted input.**

### `pop_count.ta(typed_array)`

Fast population count (counting set bits) using 8-bit and 16-bit lookup tables.

## Performance

The library is optimized for performance:
* `ta_concat` uses native memory copying.
* `Tensor` operations use fast paths for contiguous data.
* Benchmarks show ~5-8x speedup for common operations after optimization.

## AI Agent Conventions

This library follows standard tensor conventions (similar to NumPy and PyTorch) that AI agents expect:
* Row-major ordering by default.
* Automatic broadcasting for element-wise operations.
* Zero-copy views for `reshape` and `transpose` where possible.
* Explicit `shape` and `strides` metadata.

## Future Improvements

* **Contiguous Clone:** Method to create a contiguous copy of a non-contiguous tensor (e.g., after a transpose), which will enable `reshape` on any tensor.
* **Matrix Multiplication (GEMM):** Implementation of high-performance matrix multiplication.
* **Reductions:** `sum`, `mean`, `max` along specified axes.
* **Slicing:** Support for PyTorch-style slicing (e.g., `tensor.slice([0, 10], [5, 15])`).
* **GPU Acceleration:** Future support for WebGPU.
