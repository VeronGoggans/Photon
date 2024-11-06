# HTTP Model
This is a model class that has the ability to make the following requests:\
1. Post
2. Get
3. Put
4. Delete
5. Patch

The **HttpModal** class is used by every controller to communicate with the backend api.

```javascript
    export class HttpModel {

    async add(endpoint, object) {
        const options = RequestOptionsBuilder.buildPostOptions(object)
        return fetchData(endpoint, options)
    }

    /**
     * Specifiy the endpoint you want to reach.
     * @param {String} endpoint - May include a Id of some sort 
     */
    async get(endpoint) {
        const options = RequestOptionsBuilder.buildGetOptions();
        return fetchData(endpoint, options)
    }

    async update(endpoint, object) {
        const options = RequestOptionsBuilder.buildPutOptions(object)
        return fetchData(endpoint, options)
    }

    /**
     * 
     * Specifiy the endpoint you want to reach.
     * @param {String} endpoint - May include a Id of some sort
     */
    async delete(endpoint, object = null) {
        const options = RequestOptionsBuilder.buildDeleteOptions(object);
        return fetchData(endpoint, options)
    }

    async patch(endpoint) {
        const options = RequestOptionsBuilder.buildPatchOptions()
        return fetchData(endpoint, options)
    }
}
```

If a controller has a model that is both **constant** and needs to store data in memory on the client side.\
Such as the **FolderModel**, that model will  extend the **HttpModel** to inherit the ability to communicate with the backend api.

**FolderModel snippit**
```javascript
    // Extends the HttpModal
    export class FolderModel extends HttpModel {
        constructor() {
            super();
            this.folderObjects = []
        }

        // Method that handle client side data storage
        emptyFolders() {
            this.folderObjects = [];
        }

        // Method that handle client side data retrieval
        getCurrentFolder() {
            const lastFolder = this.folderObjects[this.folderObjects.length - 1];
            return lastFolder ? lastFolder : {id: 'f-1', name: 'Home'};
        }
    }
```
