import redis from 'redis'
import redisDetails from '../redis.json'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
import bluebird from 'bluebird'
import { GetSiteList, GetMetaSites, GetPostsFromMeta } from './modules/se_api'

var env = redisDetails.environments[
    redisDetails.current_environment
];
var client = redis.createClient({
    host: env.host,
    port: env.port,
    password: env.password
})
// GetMetaSites().then(data => {
//     var sites = data
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
