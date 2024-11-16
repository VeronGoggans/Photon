# Models
Models can be **constant** or **temporary**

### Constant models
If a model is constant, that means that that model gets instantiated ones when the application first starts.\
The only models that are constant are the **FolderModel** and **HttpModel**.

**Code snippit showing that the FolderModel is constant**
```javascript
    // This class gets initialized by the application controller
    // as soon as the application starts.
    export class FolderController {
        constructor(applicationController) {
            this.applicationController = applicationController;
            this.homeFolderId = 1;
            this.model = new FolderModel();
        }
    }
```

If a model is constant, that means that another controller **(That is not the parent controller)** needs to store or retrieve data from the model. 

### Temporary models
If a modal is temporary, that means that the data stored in them\
is only needed by it's own controller. 

**Example of a temporary Model**
```javascript
    /**
     * This class is used to store Editor objects togethor with it's type
     * Objects like:
     * 1. Notes
     * 2. Templates
     * 
     * Types like:
     * 1. note
     * 2. template
     * 
     * The type variable is used by the TextEditorController to determine 
     * if it needs to make a HTTP request to the NoteRouter or TemplateRouter 
     */
    export class TextEditorModel {
        constructor() {
            this.editorObject = null
            this.editorObjectType = null
        }

        storeEditorObject(editorObject, editorObjectType) {
            this.editorObject = editorObject;
            this.editorObjectType = editorObjectType;
            console.log(`Stored object: ${editorObject}`);
        }


        getStoredObject() {
            return {
                editorObject: this.editorObject, 
                editorObjectType: this.editorObjectType
            }
        }


        clear() {
            this.editorObject = null;
            console.log('CLEARED Stored Object');
        }
    }
```

The **TextEditorModel** is a good example of a temporary model.\
As the data inside it is only meaningfull for the **TextEditorController** or **TextEditorView**.

A temporary model also loses all of it's data if another view is loaded by the application controller.