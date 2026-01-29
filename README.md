# ta-util

Utilities for JavaScript Typed Arrays. This library provides a set of high-performance functions for working with Typed Arrays, including deduplication, concatenation, and population count.

## Installation

```bash
npm install ta-util
```

## API Reference

### `nta_deduplicate_sorted_ta(ta)`

Returns a new Typed Array of the same type with duplicate values removed.

* **Parameters:** `ta` (TypedArray) - The input Typed Array. **Must be sorted.**
* **Returns:** A new deduplicated TypedArray.

### `count_unique_values_in_sorted_ta(ta)`

Counts the number of unique values in a sorted Typed Array.

* **Parameters:** `ta` (TypedArray) - The input Typed Array. **Must be sorted.**
* **Returns:** `number` - The count of unique values.

### `ta_concat(arr_of_tas)`

Concatenates an array of Typed Arrays into a single Typed Array.

* **Parameters:** `arr_of_tas` (Array of TypedArrays) - The Typed Arrays to concatenate. All arrays must be of the same type.
* **Returns:** A new concatenated TypedArray, or `undefined` if the arrays are not of the same type or the input is empty.

### `get_shared_constructor(arr_things)`

Identifies the constructor shared by all elements in an array.

* **Parameters:** `arr_things` (Array) - An array of objects.
* **Returns:** The shared constructor if all elements share it, `false` if they differ, or `undefined` if the input array is empty.

### `swap_paired_array_pairs(paired_arr)`

Swaps adjacent elements in a Typed Array (e.g., `[a, b, c, d]` becomes `[b, a, d, c]`).

* **Parameters:** `paired_arr` (TypedArray) - The Typed Array to modify in-place. Must have an even length.
* **Returns:** The modified `paired_arr`.

### `pop_count`

An object containing utilities for population count (counting set bits).

* `pop_count.ta(typed_array)`: Calculates the total population count (number of set bits) across the entire Typed Array.
* `pop_count.lookup_8`: A `Uint8Array` lookup table for 8-bit values.
* `pop_count.lookup_16`: A `Uint16Array` lookup table for 16-bit values.

## Limitations & Unimplemented Features

* **Sorting Requirement:** `nta_deduplicate_sorted_ta` and `count_unique_values_in_sorted_ta` require the input array to be sorted. They do not perform sorting themselves.
* **Homogeneous Concatenation:** `ta_concat` currently requires all input arrays to be of the exact same Typed Array type. It does not support concatenating different types (e.g., `Uint8Array` with `Int8Array`).
* **Error Handling:** Some functions return `undefined` or `false` on failure instead of throwing descriptive errors.

## Future Improvements

* **`ta_concat` Optimization:** Use `TypedArray.prototype.set` for significantly faster concatenation instead of manual iteration.
* **Validation:** Add stricter input validation and more informative error messages.
* **Performance Benchmarking:** Implement a comprehensive benchmarking suite to track performance across different environments.

## Tensor Maths Notes

Building a well-rounded tensor math library on top of Typed Arrays involves several key concepts:

1.  **Storage & Layout:** Tensors are multi-dimensional, but Typed Arrays are flat. Mapping between them requires a **Shape** (dimensions) and **Strides** (the number of elements to skip in the flat array to move to the next element in a specific dimension).
2.  **Broadcasting:** Support for operations between tensors of different shapes (e.g., adding a scalar to a matrix, or a row vector to every row of a matrix) by virtually expanding the smaller tensor.
3.  **Views vs. Copies:** Many operations like `transpose`, `reshape`, or `slice` can be implemented as "views" by just changing the offset and strides without copying the underlying data.
4.  **Element-wise Operations:** Optimized loops for `add`, `subtract`, `multiply`, `divide`, `exp`, `log`, etc.
5.  **Reductions:** `sum`, `mean`, `max`, `min` along specific axes.
6.  **Matrix Multiplication:** High-performance BLAS-like operations (e.g., GEMM) are essential for deep learning.
7.  **Acceleration:** Leveraging SIMD (Single Instruction, Multiple Data) or offloading to GPU via WebGL or WebGPU for massive parallelism.
