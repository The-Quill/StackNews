import redis from 'redis'
import defaults from '../../web.config.json'
import bluebird from 'bluebird'
import debug from './debug'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const env = defaults.redis.environments[
    defaults.redis.current_environment
];

class RedisSession {
    constructor(){
        this._client = redis.createClient(env);
        this._client.on("error", err => debug.high(err))
    }
    end(){
        this._client.quit()
    }
    get client(){
        return this._client;
    }
}
export { RedisSession }
