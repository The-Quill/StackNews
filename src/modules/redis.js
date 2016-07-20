import redis from 'redis'
import redisDetails from '../../redis.json'
import bluebird from 'bluebird'
import debug from './debug'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const env = redisDetails.environments[
    redisDetails.current_environment
];

class RedisSession {
    constructor(){
        this._client = redis.createClient(env);
        this._client.on("error", err => debug.important(`Error ${err}`))
    }
    end(){
        this._client.quit()
    }
    get client(){
        return this._client;
    }
}
export { RedisSession }
