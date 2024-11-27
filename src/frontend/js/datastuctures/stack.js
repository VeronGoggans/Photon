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


export class UniqueEvictingStack extends Stack {
    constructor(capacity) {
        super();
        this.capacity = capacity
    }


    push(item) {
        // Remove item if present to ensure no duplicates
        const existingIndex = this.stack.findIndex(existing => existing.id === item.id);
        if (existingIndex !== -1) {
            this.stack.splice(existingIndex, 1);
        }

        // Remove the last item if capacity has been reached
        if (this.stack.length === this.capacity) {
            this.stack.pop();
        }

        // Move item to the front of the list
        this.stack.unshift(item);
    }


    view() {
        return [...this.stack];
    }
}
