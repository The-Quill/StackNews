import redis from 'redis'
import redisDetails from '../../redis.json'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const env = redisDetails.environments[
    redisDetails.current_environment
];
var client;

const RedisSession = {
    start: () => {
        redis.createClient(env)
        client.on("error", err => console.log(`Error ${err}`))
    },
    end: () => client.quit(),
    client: client
}
export { RedisSession }
