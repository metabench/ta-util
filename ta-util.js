
const {is_array} = require('lang-mini');

const get_shared_constructor = (arr_things) => {

    if (is_array(arr_things)) {

        const l = arr_things.length;

        if (l === 0) {
            return undefined;
        } else if (l === 1) {
            return arr_things[0].constructor;
        } else {
            const cstr = arr_things[0].constructor;
            //let res = true;
            for (let c = 1; c < l; c++) {
                if (arr_things[c].constructor !== cstr) {
                    return false;
                }
            }
            return cstr;
        }


    }
}

const get_total_length = (arr_of_arrs) => {
    let res = 0;
    for (const arr of arr_of_arrs) {
        res += arr.length;
    }
    return res;
}

const ta_concat = (arr_of_tas) => {
    
    // are they all the same type
    //  shared constructor

    const shared_constructor = get_shared_constructor(arr_of_tas);
    console.log('shared_constructor', shared_constructor);
    if (shared_constructor) {
        const total_l = get_total_length(arr_of_tas);
        const res = new shared_constructor(total_l);
        //const l = arr_of_tas.length;
        let i_w = 0;
        for (const ta of arr_of_tas) {
            const l = ta.length;
            for (let c = 0; c < l; c++) {
                res[i_w++] = ta[c];
            }
        }
        return res;
    }

}

const nta_deduplicate_sorted_ta = ta => {
    const l = ta.length;
    if (l === 0) return new ta.constructor(0);
    // count the number of unique items.
    const count = count_unique_values_in_sorted_ta(ta);
    const res = new ta.constructor(count);
    let i = 0;
    let prev = ta[0];
    res[i++] = prev;
    for (let c = 1; c < l; c++) {
        const n = ta[c];
        if (n !== prev) {
            res[i++] = n;
            prev = n;
        }
    }
    return res;
}


const count_unique_values_in_sorted_ta = (ta) => {
    const l = ta.length;
    if (l === 0) return 0;
    let res = 1;
    let current, prev = ta[0], c;
    for (c = 1; c < l; c++) {
        current = ta[c];
        if (current !== prev) {
            res++;
            prev = current;
        }
    }
    return res;
}

const swap_paired_array_pairs = (paired_arr) => {
    const l = paired_arr.length;
    if (l % 2 === 0) {
        //const half_l = l >> 1;
        //console.log('[l, half_l]', [l, half_l]);
        for (let c = 0; c < l; c+=2) {
            const t = paired_arr[c];
            paired_arr[c] = paired_arr[c + 1];
            paired_arr[c + 1] = t;
        }
    }
    return paired_arr;


}


// Create a 1-byte lookup table for population count of each byte value (0-255)
const create_pop_count_lookup_table_8 = () => {
    const table = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
        table[i] = (i & 1) + table[i >> 1];
    }
    return table;
};

// Create a 2-byte lookup table for population count of each 16-bit value (0-65535)
const create_pop_count_lookup_table_16 = () => {
    const table = new Uint16Array(65536);
    for (let i = 0; i < 65536; i++) {
        table[i] = (i & 1) + table[i >> 1];
    }
    return table;
};

const lookup_8 = create_pop_count_lookup_table_8();
const lookup_16 = create_pop_count_lookup_table_16();

const pop_count_typed_array = (typed_array) => {
    const buffer = typed_array.buffer;
    const byte_offset = typed_array.byteOffset;
    const byte_length = typed_array.byteLength;
    const byte_length_minus_two = byte_length - 2;

    let total_pop_count = 0;
    const data_view = new DataView(buffer, byte_offset, byte_length);

    // Process two bytes at a time
    let i = 0;
    for (; i <= byte_length_minus_two; i += 2) {
        const byte_value = data_view.getUint16(i, true);
        total_pop_count += lookup_16[byte_value];
    }

    // Process any remaining single byte
    if (i < byte_length) {
        const remaining_byte = data_view.getUint8(i);
        total_pop_count += lookup_8[remaining_byte];
    }

    return total_pop_count;
};

const pop_count = {
    lookup_8, lookup_16, ta: pop_count_typed_array
}


module.exports = {
    nta_deduplicate_sorted_ta,
    count_unique_values_in_sorted_ta,
    ta_concat,
    get_shared_constructor,
    swap_paired_array_pairs,
    pop_count
};