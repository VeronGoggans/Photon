import { fetchData } from "../../util/http_request/request.js";
import { RequestOptionsBuilder } from "../../util/http_request/requestOptionsBuilder.js";

export class HttpModel {

    static async post(endpoint, object) {
        const options = RequestOptionsBuilder.buildPostOptions(object)
        return fetchData(endpoint, options)
    }

    static async get(endpoint) {
        const options = RequestOptionsBuilder.buildGetOptions();
        return fetchData(endpoint, options)
    }

    static async put(endpoint, object) {
        const options = RequestOptionsBuilder.buildPutOptions(object)
        return fetchData(endpoint, options)
    }

    static async delete(endpoint, object = null) {
        const options = RequestOptionsBuilder.buildDeleteOptions(object);
        return fetchData(endpoint, options)
    }

    static async patch(endpoint, object = null) {
        const options = RequestOptionsBuilder.buildPatchOptions(object)
        return fetchData(endpoint, options)
    }
}