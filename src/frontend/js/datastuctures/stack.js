export class Stack {
    constructor() {
        this.stack = []
    }

    push(item) {
        this.stack.push(item);
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        return this.stack[this.stack.length - 1];
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    clear() {
        this.stack = [];
    }

    size() {
        return this.stack.length;
    }
}


export class BoundedStack extends Stack {
    constructor(capacity) {
        super();
        this.capacity = capacity;
    }

    push(item) {
        if (this.size() < this.capacity) {
            this.stack.push(item);
        }
    }

    isFull() {
        return this.size() == this.capacity;
    }
}


export class EvictingStack extends Stack {
    constructor(capacity) {
        super();
        this.capacity = capacity
    }

    push(item) {
        if (this.stack.length === this.capacity) {
          this.stack.shift();
        }
        this.stack.push(item);
    }

    view() {
        return [...this.stack];
    }
}
