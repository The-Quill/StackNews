import { HtmlRequest, JsonRequest } from './request'
import querystring from 'querystring';

function fetchUntilEnd(options, iteration){
    let pageNumber = 1
    var generatePageVar = () => pageNumber++
    return new Promise(function(resolve, reject){
        var fetch = function(){
            var queryStrings = querystring.parse('');
            var url = options.url;
            if (options.url.split('?').length > 1){
                queryStrings = querystring.parse(options.url.split('?')[1]);
                url = options.url.split('?')[0];
            }
            queryStrings.page = generatePageVar();
            options.url = `${url}?${querystring.stringify(queryStrings) || 1}`
            return JsonRequest(options)
            .catch(...error => reject([...error]))
            .then((data) => {
                iteration(data)
                if (data.has_more) fetch()
                else resolve()
            })
        }
        fetch()
    })
}
function GetSiteList(){
    var sites = [];
    var options = {
        url: 'https://api.stackexchange.com/2.2/sites',
        method: 'GET'
    }
    return new Promise(function(resolve, reject){
        fetchUntilEnd(options, data => sites = Array.concat(sites, data.items))
        .then(() => resolve(sites))
        .catch(error => reject(error))
    })
}
function SiteNameToApiFormat(sitename){
    sitename = sitename.toLowerCase();
    var isMeta = sitename.contains('meta')
    // this should use a /sites lookup, but for now, no dice.
    return `${isMeta ? 'meta.' : ''}${sitename.replace('meta', '').replace(/ /g, '')}`;
}
function GetPostsFromMeta(sitename){
    var posts = [];
    var options = {
        url: `https://api.stackexchange.com/2.2/questions?order=desc&sort=creation&site=${sitename}`,
        method: 'GET'
    }
    return new Promise(function(resolve, reject){
        fetchUntilEnd(options, post => posts.push(post))
        .then(() => resolve(posts))
        .catch(error => reject(error))
    })
}
function GetMetaSites(){
    return new Promise(function(resolve, reject){
        GetSiteList()
        .then(data => resolve(data.filter(site => site.name.toLowerCase().includes('meta'))))
        .catch(error => reject(error))
    })
}
export { GetSiteList, GetMetaSites, GetPostsFromMeta, SiteNameToApiFormat }
