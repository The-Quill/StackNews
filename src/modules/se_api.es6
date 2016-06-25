import { HtmlRequest, JsonRequest } from './request'
import querystring from 'querystring';

async function SiteNameToApiFormat(sitename){
    sitename = sitename.toLowerCase();
    var isMeta = sitename.contains('meta')
    // this should use a /sites lookup, but for now, no dice.
    return `${isMeta ? 'meta.' : ''}${sitename.replace('meta', '').replace(/ /g, '')}`;
}
function Url(url){
    var queryStrings = querystring.parse('');
    var newUrl = url;
    if (url.split('?').length > 1){
        queryStrings = querystring.parse(url.split('?')[1])
        newUrl = url.split('?')[0]
    }
    return {
        base: newUrl,
        old: url,
        generate: function() {
            return `${this.base}?${querystring.stringify(this.queryStrings) || 1}`
        },
        queryStrings: queryStrings
    }
}
const is = {
    Meta: name => { return name.toLowerCase().includes('meta') },
    Main: name => { return name.toLowerCase() != "meta stack exchange" && !name.toLowerCase().includes('meta') }
}
async function fetchUntilEnd(options, iteration){
    var items = []
    try {
        let pageNumber = 1
        var generatePageVar = () => pageNumber++
        var hasMore = true;
        var i = 0;
        while (hasMore){
            var url = Url(options.url);
            url.queryStrings.page = generatePageVar()
            url.queryStrings.pagesize = url.queryStrings.pagesize || 100;
            options.url = url.generate()
            let result = await JsonRequest(options);
            items = Array.concat(items, result.items)
            hasMore = result.hasOwnProperty('has_more') ? result.has_more : false
        }
        return Promise.resolve(items)
    } catch (error){
        throw error;
    }
}
async function fetchOnce(options, iteration){
    try {
        var queryStrings = querystring.parse('');
        var url = options.url;
        if (options.url.split('?').length > 1){
            queryStrings = querystring.parse(options.url.split('?')[1])
            url = options.url.split('?')[0]
        }
        queryStrings.pagesize = 100
        options.url = `${url}?${querystring.stringify(queryStrings) || 1}`
        let result = await JsonRequest(options)
        return Promise.resolve(result);
    } catch(error){
        throw error;
    }
}
async function GetSiteList(){
    var options = {
        url: 'https://api.stackexchange.com/2.2/sites',
        method: 'GET'
    }
    try {
        let sites = await fetchUntilEnd(options);
        return Promise.resolve(sites)
    } catch (error){
        return Promise.reject()
    }
}
async function GetMetaSites(){
    try {
        let sites = await GetSiteList()
        let filteredSites = sites.filter(site => site.site_type == "meta_site" || site.api_site_parameter == "meta")
        return Promise.resolve(filteredSites)
    } catch (error){
        return Promise.reject()
    }
}
async function GetPostsFromMeta(sitename){
    var options = {
        url: `https://api.stackexchange.com/2.2/questions?order=desc&sort=creation&site=${sitename}`,
        method: 'GET'
    }
    try {
        let posts = await fetchUntilEnd(options)
        return Promise.resolve(posts)
    } catch (error){
        return Promise.reject()
    }
}

export { GetMetaSites, GetPostsFromMeta, GetSiteList, SiteNameToApiFormat, Url, is }
