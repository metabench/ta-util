
const { nta_deduplicate_sorted_ta, count_unique_values_in_sorted_ta, ta_concat, swap_paired_array_pairs, pop_count, Tensor } = require('./ta-util');

const test_deduplicate = () => {
    console.log('Testing deduplicate...');
    const ta = new Int8Array([-1, 0, 1]);
    const count = count_unique_values_in_sorted_ta(ta);
    console.log('Count of [-1, 0, 1]:', count, '(Expected: 3)');
    const deduplicated = nta_deduplicate_sorted_ta(ta);
    console.log('Deduplicated [-1, 0, 1]:', deduplicated, '(Expected: Int8Array [-1, 0, 1])');
};

const test_ta_concat = () => {
    console.log('\nTesting ta_concat...');
    const ta1 = new Uint8Array([1, 2]);
    const ta2 = new Uint8Array([3, 4]);
    const concatenated = ta_concat([ta1, ta2]);
    console.log('Concatenated:', concatenated, '(Expected: Uint8Array [1, 2, 3, 4])');
};

const test_tensor = () => {
    console.log('\nTesting Tensor...');
    const t1 = new Tensor(new Float32Array([1, 2, 3, 4]), [2, 2]);
    const t2 = new Tensor(new Float32Array([10, 20, 30, 40]), [2, 2]);

    const resAdd = t1.add(t2);
    console.log('Add Result:', resAdd.data, '(Expected: [11, 22, 33, 44])');

    const t3 = new Tensor(new Float32Array([100, 200]), [2]);
    const resBroadcast = t1.add(t3);
    console.log('Broadcast Add Result:', resBroadcast.data, '(Expected: [101, 202, 103, 204])');

    const tTransposed = t1.transpose();
    console.log('Transposed Shape:', tTransposed.shape, '(Expected: [2, 2])');
    console.log('Transposed Value at [1, 0]:', tTransposed.get(1, 0), '(Expected: 2)');
};

test_deduplicate();
test_ta_concat();
test_tensor();
