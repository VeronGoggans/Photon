export class Stack {
    constructor() {
        this.items = []
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }

    size() {
        return this.items.length;
    }
}


export class BoundedStack extends Stack {
    constructor(limit) {
        super();
        this.limit = limit;
    }

    push(item) {
        if (this.size() < this.limit) {
            this.items.push(item);
        }
    }

    isFull() {
        return this.size() == this.limit;
    }
}
