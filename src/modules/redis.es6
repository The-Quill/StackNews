import redis from 'redis'
import redisDetails from '../../redis.json'
import bluebird from 'bluebird'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const env = redisDetails.environments[
    redisDetails.current_environment
];

class RedisSession {
    constructor(){
        this.client = redis.createClient(env);
        client.on("error", err => console.log(`Error ${err}`))
    },
    end() => this.client.quit(),
    get client(){
        return this.client;
    }
}
export { RedisSession }
