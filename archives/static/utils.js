/**
 * It takes an array of objects, a key, and a boolean value. It returns an array of values from the
 * objects in the array that match the key. If the boolean value is true, it will only return unique
 * values
 * @param arr - the array of objects
 * @param key - the key you want to get the values from
 * @param uniqueValues - true|false
 * @returns An array of values from the key of each object in the array.
 */
function getValuesByKey(arr, key, uniqueValues) {
    // uniqueValues param is true|false
    let result = [];
    for (const element of arr) {
      let obj = element;
      if (uniqueValues === true) {
        if (result.indexOf(obj[key]) === -1) {
          result.push(obj[key]);
        }
      }
      else {
        result.push(obj[key]);
      }
    }
    return result;
  }

  /**
 * It takes an array, a key, an order, and a type, and returns the array sorted by the key in the order
 * specified, with the type specified.
 * @param array - the array you want to sort
 * @param key - the key to sort by
 * @param order - 'asc' or 'desc'
 * @param type - 'date' or 'number'
 * @returns The sorted array.
 */
function sortBy(array, key, order, type) {
  return array.sort((a, b) => {
    if (order === 'asc') {
      if (type === 'date') {
        return new Date(a[key]) - new Date(b[key]);
      }
      else {
        return a[key] - b[key];
      }
    }
    else if (order === 'desc') {
      if (type === 'date') {
        return new Date(b[key]) - new Date(a[key]);
      }
      else {
        return b[key] - a[key];
      }
    }
  })
}

/**
 * It takes an array of objects and returns an array of arrays where the first array is the keys of the
 * objects and the rest of the arrays are the values of the objects.
 * @param arr - an array of objects
 * @returns An array of arrays.
 */
function toTable(arr) {
  let result = [];
  let keys = getKeys(arr);
  result.push(keys);
  for (const element of arr) {
    let obj = element;
    let row = [];
    for (const element of keys) {
      let key = element;
      if (obj[key] === undefined) {
        row.push(0);
      } else {
        row.push(obj[key]);
      }
    }
    result.push(row);
  }
  return result;
}

/**
 * It loops through the array, then loops through each object in the array, and pushes the property
 * name to the result array if it's not already in the result array.
 * @param arr - an array of objects
 * @returns An array of the keys of the objects in the array.
 */
function getKeys(arr) {
  let result = [];
  for (const element of arr) {
    let obj = element;
    for (const prop in obj) {
      if (!result.includes(prop)) {
        result.push(prop);
      }
    }
  }
  return result;
}