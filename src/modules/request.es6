import request from 'request-promise'
import dom from 'cheerio'

function Request(options){
    let defaultOptions = {
        gzip: true
    }
    return request(Object.assign(defaultOptions, options))
}
function HtmlRequest(options){
    let defaultOptions = {
        transform: function (body) {
            return dom.load(body);
        }
    }
    return Request(Object.assign(options, defaultOptions))
}
function JsonRequest(options){
    let defaultOptions = {
        json: true
    }
    return Request(Object.assign(options, defaultOptions))
}
export { HtmlRequest, JsonRequest }
