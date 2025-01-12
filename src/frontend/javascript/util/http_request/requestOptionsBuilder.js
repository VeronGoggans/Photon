export class RequestOptionsBuilder {
    static buildGetOptions() {
        return {
            method: 'GET'
        };
    }

    static buildPostOptions(bodyData) {
        return {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        };
    }

    static buildPutOptions(bodyData) {
        return {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        };
    }

    static buildPatchOptions(bodyData) {
        return {
            method: 'PATCH',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        }
    }

    static buildDeleteOptions(bodyData) {
        return {
            method: 'DELETE',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(bodyData)
        };
    }
}
