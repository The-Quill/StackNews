import request from 'request-promise'
import dom from 'cheerio'

async function Request(options){
    let defaultOptions = {
        gzip: true
    }
    return new Promise(
        (resolve, reject) => {
            request(Object.assign(defaultOptions, options))
            .then(data => resolve(data))
            .error(error => reject(error))
        }
    );
}
async function HtmlRequest(options){
    let defaultOptions = {
        transform: function (body) {
            return dom.load(body);
        }
    }
    return await Request(Object.assign(options, defaultOptions))
}
async function JsonRequest(options){
    let defaultOptions = {
        json: true
    }
    return await Request(Object.assign(options, defaultOptions))
}
export { HtmlRequest, JsonRequest }
