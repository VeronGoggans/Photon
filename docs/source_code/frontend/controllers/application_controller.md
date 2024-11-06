# Application controller
The Application Controller serves as a middle man for communication between controllers.\
All the crud method inside the application controller are there for that reason only.\
Like this I maintain **seperation of concerns.**

**Examples of comminucation methods**

```javascript
   // These methods don't contain any logic besides communicating with different controllers
   // to accomplish a task. 
   async addNote(name, content, notify) {
        const { id } = this.folderController.getCurrentFolder();
        const note = await this.noteController.add(id, name, content, notify);
        this.textEditorController.storeEditorObject(note, 'note')
    }

    async getNotes(folderId) {
        await this.noteController.get(folderId);
    }

```

## InitView method
> This method is responsible for loading and initializing the specified view.


**Parameters**

1. viewId
2. viewParameters

<br>

|                |                                                                 |
| -------------- | --------------------------------------------------------------- |
| Parameter      | Explanation                                                     |
| viewId         | Is a String value representing which view should be loaded.     |
| viewParameters | Is an Object that can vary based on which view is being loaded. |

<br>

> 
> ## Method Edge cases
> As said above the **viewId** is used to tell the **initView method** which view to load/initialize.\
> **viewId** can only be one of these fixed values 
>
> 1. home
> 2. notes
> 3. editor
> 4. flashcardsHome
> 5. flashcardsPractice
> 6. flashcardEdit
> 7. templates
> 8. stickyWall
> 9. settings
>
> **viewParameters** by default is an empty object,\
> but can vary based on what view is being loaded. 


### viewParameters for the notes view

```json
   {
    "folder": "Object",
    "location": "Object"
   } 
```

<br>

|           |                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Key | Value                                                                                                                                                     |
| folder    | The folder that the notes view should load                                                                                                                      |
| location  | A hierarchical array of folder objects. This value can only be null if the notes view is loaded in when the exit button inside the editor view has been clicked. |

<br>

### viewParameters for the editor view

```json
   {
    "editorObjectType": "String",
    "editorObject": "Object",
    "newEditorObject": "Boolean",
    "previousView": "String",
    "editorObjectLocation": "list"
   } 
```

<br>

|                      |                                                                                                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Key                  | Value                                                                                                                                                                                                                                        |
| editorObjectType     | A string telling the editor if a note or template is being **made/edited**                                                                                                                                                                   |
| editorObject         | This can either be a note/template object or null. If a note/template has been clicked on this value will be an object. But if the add note/add template button has been clicked on this value is null as there is no object to begin with.  |
| newEditorObject      | A boolean value telling the texteditor Model if it is creating or editing a note/template                                                                                                                                                    |
| previousView         | A string value telling the texteditor controller which view to load when the exit editor button has been clicked.                                                                                                                            |
| editorObjectLocation | A hierarchical array of folder objects representing the note location within the folder structure                                                                                                                                            |

<br>

## Scenarios for the editorObjectLocation Value

| Scenario                                                         | editorObjectLocation Value |
| ---------------------------------------------------------------- | -------------------------- |
| Clicking on a note card                                          | Null                       |
| Clicking on a note card from the home screen                     | List                       |
| Searching a note from the search bar                             | List                       |
| Searching a template from the search bar                         | Null                       |
| Opening the editor by clicking on the **create note button**     | Null                       |
| Opening the editor by clicking on the **create template button** | Null                       |
| Clicking on a template card                                      | Null                       |

### viewParameters for the flashcardsPractice & flashcardEdit view
```json
   {
    "deck": "Object",
    "previousView": "String"
   } 
```

<br>

|              |                                                             |
| ------------ | ----------------------------------------------------------- |
| Key          | Value                                                       |
| deck         | The deck object the practice view will load                 |
| previousView | The view that was loaded prior to loading the practice view |
