import { HtmlRequest, JsonRequest } from './request'
import { Time } from './time'
import querystring from 'querystring';
import sleep from 'sleep';

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
        var result;
        while (hasMore){
            var url = Url(options.url);
            url.queryStrings.key = "zDO2gMEs69ZZpSZRjl6LFw((";
            url.queryStrings.page = generatePageVar()
            url.queryStrings.pagesize = url.queryStrings.pagesize || 100;
            options.url = url.generate()
            result = await JsonRequest(options);
            if (result.hasOwnProperty('backoff')){
                console.log(`Backoff received, waiting ${result.backoff} seconds`)
                await sleep.sleep(result.backoff)
                await sleep.sleep(60)
                console.log(`returning from backoff`);
            }
            await sleep.sleep(4)
            items = Array.concat(items, result.items)
            hasMore = result.hasOwnProperty('has_more') ? result.has_more : false
        }
        console.log(`Used ${result.quota_max - result.quota_remaining} out of ${result.quota_max} requests`)
        return Promise.resolve(items)
    } catch (error){
        throw error;
    }
}
async function fetchOnce(options, iteration){
    try {
        var queryStrings = querystring.parse('');
        var url = Url(options.url);
        url.queryStrings.key = "zDO2gMEs69ZZpSZRjl6LFw((";
        url.queryStrings.pagesize = 100
        options.url = url.generate()
        let result = await JsonRequest(options)
        if (result.hasOwnProperty('backoff')){
            await sleep.sleep(result.backoff)
        }
        await sleep.sleep(4)
        return Promise.resolve(result.items);
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
async function GetPostsFromSite(sitename, modifiedDate){
    var options = {
        url: `https://api.stackexchange.com/2.2/questions?order=desc&filter=!gB57Fc-gHH5vhESOcDSS28xXhsx8UxMt5CF&sort=activity&site=${sitename}${modifiedDate ? `&min=${modifiedDate}` : ''}`,
        method: 'GET'
    }
    try {
        let posts = await fetchUntilEnd(options)
        console.log(` - Grabbed ${posts.length} posts from ${sitename}`)
        return Promise.resolve(posts)
    } catch (error){
        return Promise.reject(error)
    }
}

export { GetMetaSites, GetPostsFromSite, GetSiteList, SiteNameToApiFormat, Url, is }
