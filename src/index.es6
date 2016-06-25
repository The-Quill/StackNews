import { GetSiteList, GetMetaSites, GetPostsFromMeta } from './modules/se_api'
import { RedisSession } from './modules/redis'



client.set("foo", "bar", redis.print);
client.getAsync('foo').then(function(res) {
    console.log(res); // => 'bar'
});

var result = fetchOnce({
    url: 'https://api.stackexchange.com/2.2/sites',
    method: 'GET'
});
result.then(data => console.log(data));
//
// GetMetaSites().then(data => {
//     var sites = data
//     sites.forEach(site => {
//         return client.getAsync(`site:${site.api_site_parameter}`).then(function(res, reply) {
//             if (reply == null){
//
//             }
//             console.log(res); // => 'bar'
//         });
//     })
//
//     //console.log(sites.map(site => site.name).join('\n'))
//     console.log(sites[3].api_site_parameter)
//     console.log(sites[90].api_site_parameter)
//     GetPostsFromMeta(sites[3].api_site_parameter).then(data => {
//         console.log(data)
//     })
//     GetPostsFromMeta(sites[90].api_site_parameter).then(data => {
//         console.log(data)
//     })
// })
