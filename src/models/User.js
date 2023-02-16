class User {
    #id;
    #name;
    #balance;
    #createTimestamp;

    constructor(id = null, name = null, balance = null, createTimestamp = null) {
        this.#id = id;
        this.#name = name;
        this.#balance = balance;
        this.#createTimestamp = createTimestamp;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }


    setName(name) {
        this.#name = name;
    }

    getBalance() {
        return this.#balance;
    }

    setBalance(balance) {
        this.#balance = balance;
    }

    getCreateTimestamp() {
        return this.#createTimestamp;
    }

    setCreateTimestamp(timestamp) {
        this.#createTimestamp = timestamp;
    }
}

module.exports = {
    User,
};