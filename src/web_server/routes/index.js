import { RedisSession } from '../../modules/redis'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Application } from '../components'

const session = new RedisSession();

async function getPosts(offsetMultiplier, perPage){
    // count
    // zrangebyscore posts -inf +inf LIMIT 50000 10
    let count = await session.client.zcardAsync('posts')
    let offset = (offsetMultiplier === 0 ? 1 : offsetMultiplier) * perPage
    let fetch = count - offset
    return session.client.zrangebyscoreAsync(['posts', '-inf', '+inf', 'LIMIT', `${fetch}`, `${perPage}`])
}
let IndexRoute = function(req, res){
    // const { path } = req

    getPosts(1, 30).then(async function(itemKeys) {
        var posts = []
        for (var i = 0; i < itemKeys.length; i++){
            let post = await session.client.hgetallAsync(`post:${itemKeys[i]}`)
            posts.push(post)
        }
        let app = <Application items={posts.reverse()} />
        res.write(renderToString(app))
        res.end()
    })
};

export { IndexRoute as default }
