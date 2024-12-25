import { fetchData } from "../util/http_request/request.js";
import { RequestOptionsBuilder } from "../util/http_request/requestOptionsBuilder.js";

export class HttpModel {

    async add(endpoint, object) {
        const options = RequestOptionsBuilder.buildPostOptions(object)
        return fetchData(endpoint, options)
    }

    /**
     * Specify the endpoint you want to reach.
     * @param {String} endpoint - May include an ID of some sort
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
     * Specify the endpoint you want to reach.
     * @param {String} endpoint - May include an ID of some sort
     */
    async delete(endpoint, object = null) {
        const options = RequestOptionsBuilder.buildDeleteOptions(object);
        return fetchData(endpoint, options)
    }

    async patch(endpoint, object = null) {
        const options = RequestOptionsBuilder.buildPatchOptions(object)
        return fetchData(endpoint, options)
    }
}