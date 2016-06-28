import request from 'request-promise'
import dom from 'cheerio'
import errors from 'request-promise/errors'

async function Request(options){
    let defaultOptions = {
        gzip: true
    }
    return new Promise(
        (resolve, reject) => {
            //console.log(`Fetching data from ${options.url}`)
            request(Object.assign(defaultOptions, options))
            .then(data => resolve(data))
            .catch(errors.StatusCodeError, function (reason) {
                console.log(`oh shit, the server responded with a ${reason.statusCode}. you messed up dude.`)
            })
            .catch(errors.RequestError, function (reason) {
                reject(`Shoddy options provided. URL was ${options.url} and reason was ${reason.cause}`)
            });
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
