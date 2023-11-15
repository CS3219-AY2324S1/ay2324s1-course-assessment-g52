class Predicate {
    constructor(cond1, op, cond2) {
        this.cond1 = cond1;
        this.cond2 = cond2;
        this.op = op;
    }

    toString() {
        return `${cond1} ${op} ${cond2}`;
    }
    getCond1() {
        return this.cond1;
    }
    getCond2() {
        return this.cond2;
    }
    getOp() {
        return this.op;
    }

}

export default Predicate;