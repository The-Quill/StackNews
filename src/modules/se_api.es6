import { HtmlRequest, JsonRequest } from './request'
import querystring from 'querystring';

export function Url(url){
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
            `${this.base}?${querystring.stringify(this.queryStrings) || 1}`
        },
        queryStrings: queryStrings
    }
}
export const is = {
    Meta: name => { return name.toLowerCase().includes('meta') },
    Main: name => { return name.toLowerCase() != "meta stack exchange" && !name.toLowerCase().includes('meta') }
}
async function fetchUntilEnd(options, iteration){
    try {
        let pageNumber = 1
        var generatePageVar = () => pageNumber++
        var fetch = async function(){
            var url = Url(options.url);
            url.queryStrings.page = generatePageVar()
            url.queryStrings.pagesize = 100
            options.url = url.generate()
            let result = await JsonRequest(options);
            iteration(result);
            if (result.has_more){
                fetch()
            } else {
                return Promise.resolve()
            }
        }
        return fetch()
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
export async function GetSiteList(){
    var sites = [];
    var options = {
        url: 'https://api.stackexchange.com/2.2/sites',
        method: 'GET'
    }
    try {
        await fetchUntilEnd(options, data => sites = Array.concat(sites, data.items))
        Promise.resolve(sites)
    } catch (error){
        Promise.reject()
    }
}
export async function SiteNameToApiFormat(sitename){
    sitename = sitename.toLowerCase();
    var isMeta = sitename.contains('meta')
    // this should use a /sites lookup, but for now, no dice.
    return `${isMeta ? 'meta.' : ''}${sitename.replace('meta', '').replace(/ /g, '')}`;
}
export async function GetPostsFromMeta(sitename){
    var posts = [];
    var options = {
        url: `https://api.stackexchange.com/2.2/questions?order=desc&sort=creation&site=${sitename}`,
        method: 'GET'
    }
    try {
        await fetchUntilEnd(options, post => posts.push(post))
        Promise.resolve(posts)
    } catch (error){
        Promise.reject()
    }
}
export async function GetMetaSites(){
    try {
        let sites = await GetSiteList(options, post => posts.push(post))
        Promise.resolve(sites.filter(site => is.Meta(site)))
    } catch (error){
        Promise.reject()
    }
}
