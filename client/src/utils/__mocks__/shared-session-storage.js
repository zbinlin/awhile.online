"use strict";

class Storage extends Map {
    getItem(key) {
        return this.get(key);
    }
    setItem(key, value) {
        return this.set(key, value);
    }
    removeItem(key) {
        return this.delete(key);
    }
    length() {
        return this.size;
    }
    key(idx) {
        return this.get([...this.keys()][idx]);
    }
}

export default new Storage();
