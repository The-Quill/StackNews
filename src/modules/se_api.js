import { HtmlRequest, JsonRequest } from './request'
import { RedisSession } from './redis'
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
async function fetchUntilEnd(options = {}){
    var items = []
    if (!options.hasOwnProperty('url')){
        throw new Error('Url not provided')
    }
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
                console.log(`Backoff received trying to access ${url.queryStrings.site}, waiting ${result.backoff} seconds`)
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
        console.error(`api: ${error}`);
        return Promise.reject(error);
    }
}
async function fetchOnce(options = {}){
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
async function GetPostsFromSite(sitename = 'meta', since = '0'){
    let modifiedDate = Math.floor(since / 1000)
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
async function FetchPosts(offsetMultiplier = 1, perPage = 30){
    // count
    // zrangebyscore posts -inf +inf LIMIT 50000 10
    let session = new RedisSession();
    let count = await session.client.zcardAsync('posts')
    let offset = (offsetMultiplier === 0 ? 1 : offsetMultiplier) * perPage
    let fetch = count - offset
    return session.client.zrangebyscoreAsync(['posts', '-inf', '+inf', 'LIMIT', `${fetch}`, `${perPage}`])
}
async function LoadNewPosts(page = 1, count = 30){
    // command for clearing redis keys:
    // EVAL "local keys = redis.call('keys', ARGV[1]) \n for i=1,#keys,5000 do \n redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) \n end \n return keys" 0 post:*
    let session = new RedisSession();
    let itemKeys = await FetchPosts(page, count);
    var posts = []
    for (var i = itemKeys.length - 1; i >= 0; i--){
        let post = await session.client.hgetallAsync(`post:${itemKeys[i]}`)
        if (!post.hasOwnProperty('site')){
            console.error('site property not found on post')
            continue;
        }
        post.site = await session.client.hgetallAsync(`site:${post.site}`)
        posts.push(post)
    }
    return Promise.resolve(posts)
}

export { GetMetaSites, GetPostsFromSite, GetSiteList, SiteNameToApiFormat, FetchPosts, LoadNewPosts, Url, is }
