import { RedisSession } from '../../modules/redis'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Application } from '../components'
// async function getPosts(){
//     return await getPostsOrSomething();
// }
let IndexRoute = function(req, res){
    //let items = await getPosts();
    let items = [
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        }
    ]
    // const { path } = req
    const app = <Application items={items} />
    res.write(renderToString(app))
    res.end()
};

export { IndexRoute as default }
