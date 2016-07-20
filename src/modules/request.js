import request from 'request-promise'
import dom from 'cheerio'
import errors from 'request-promise/errors'
import sleep from 'sleep'
import debug from './debug'

async function Request(options){
    let defaultOptions = {
        gzip: true
    }
    var isInProgress = true;
    var attempts = 0;
    var failedAttempts = 0;
    var result;
    while(isInProgress){
        attempts++;
        try {
            result = await request(Object.assign(defaultOptions, options))
            isInProgress = false
        } catch(error) {
            failedAttempts = attempts;
            debug.medium(`  - Attempt no ${attempts} failed for url ${options.url}`)
            if (attempts > 10){
                console.error(error)
                return Promise.reject(error)
            }
        }
    }
    debug.medium(`  - Attempt no ${attempts} passed after failing ${failedAttempts} attempts..`)
    return Promise.resolve(result)
}
async function HtmlRequest(options){
    let defaultOptions = {
        transform: function (body) {
            return dom.load(body);
        }
    }
    return Request(Object.assign(options, defaultOptions))
}
async function JsonRequest(options){
    let defaultOptions = {
        json: true
    }
    return Request(Object.assign(options, defaultOptions))
}
export { HtmlRequest, JsonRequest }
