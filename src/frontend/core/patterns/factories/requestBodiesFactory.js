export class RequestBodyFactory {

    static getPostFolderBody(parentId, name, color) {
        return {
            route: '/folders',
            body: {
                'parent_id': parentId,
                'color': color,
                'name': name
            }
        }
    }


    static getPutFolderBody(folderId, name, color) {
        return {
            route: `/folders/${folderId}`,
            body: {
                'name': name,
                'color': color
            }
        }
    }



    static getPostCategoryBody(name, color) {
        return {
            route: '/categories',
            body: {
                'color': color,
                'name': name
            }
        }
    }



    static getPutCategoryBody(name, color) {
        return {
            route: '/categories',
            body: {
                'color': color,
                'name': name
            }
        }
    }

    


}