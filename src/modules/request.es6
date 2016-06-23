import request from 'request-promise';
import dom from 'cheerio';

function Request(options, success, error){
    var defaultOptions = {
        transform: function (body) {
            return dom.load(body);
        },
        json: true
    };

    return request(Object.assign(options, defaultOptions))
    .then(function ($) {
        return success($);
    })
    .catch(function (err) {
        return error(err);
    });
}
export { Request };
