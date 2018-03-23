'use strict';

const IEnumerable = require('./../IEnumerable');

const Enumerable = require('./../Enumerable');

const IndicesEnumerable = require('./IndicesEnumerable');

const core = require('./../core/core');

const NoSuchElementsException = require('./../core/exceptions/NoSuchElementsException');

class CombinationEnumerable extends IEnumerable {
    constructor(source, count) {
        super(source);
        core.defineProperty(this, Symbol.iterator, function* CombinationIterator() {
            let iterator = source[Symbol.iterator]();
            let indices = Enumerable.repeat(0, count).toArray();
            let array = [];
            let end = false;
            let hasNext = () => {
                let next = iterator.next();
                if (next.done) {
                    end = true;
                    return false;
                } else {
                    array.push(next.value);
                    return true;
                }
            };
            let nextIndices = () => {
                for (let i = count - 1; i >= 0; i--) {
                    let needNext = false;
                    indices[i]++;
                    if (indices[i] >= array.length) {
                        if (end || !hasNext()) {
                            needNext = true;
                        }
                    }
                    if (!needNext) {
                        for (let j = i + 1; j < count; j++) {
                            indices[j] = indices[i];
                        }
                        return true;
                    }
                }
                return false;
            };

            if (hasNext()) {
                do {
                    yield new IndicesEnumerable(array, [...indices]);
                } while (nextIndices());
            } else {
                throw new NoSuchElementsException();
            }
        });
    }
}

module.exports = CombinationEnumerable;