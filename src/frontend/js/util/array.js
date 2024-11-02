class ObjectArray {
    constructor() {
        this.objects = []
    }

    add(object) {
        this.objects.push(object);
    }

    remove(object) {
        const ID = object.id;

        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === ID) {
                this.objects.splice(i, 1);
            }
        }
    }

    get(objectId) {
        return this.objects.find(obj => obj.id === objectId)
    }

    getLast() {
        return this.objects[this.objects.length - 1]
    }

    clear() {
        this.objects = [];
    }

    size() {
        return this.objects.length;
    }
}

export class FlashcardObjectArray extends ObjectArray {
    getNewCard(flashcardId, nextCard) {        
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === flashcardId) {
                if (nextCard) {
                    return this.objects[i + 1];
                }                
                return this.objects[i - 1];
            }
        }
        return this.objects[0]
    }


    update(flashcard) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === flashcard.id) {
                this.objects[i].term = flashcard.term;
                this.objects[i].description = flashcard.description
                this.objects[i].rating = flashcard.rating
            }
        }
    }
}


export class TaskObjectArray extends ObjectArray {
    update(task) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id === task.id) {
                this.objects[i].name = task.name;
                this.objects[i].description = task.description;
                this.objects[i].due_date = task.due_date;
                this.objects[i].tag = task.tag
            }
        }
    }
}