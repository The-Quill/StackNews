import { RedisSession } from '../../modules/redis'
import { FetchPosts } from '../../modules/se_api'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Application, Head } from '../components'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import PostsReducer from '../reducers/posts'

const session = new RedisSession();


let IndexRoute = function(req, res){
    console.log(`Got route`)
    // const { path } = req
    const store = createStore(PostsReducer)

    // Render the component to a string


    // Grab the initial state from our Redux store
    const preloadedState = store.getState()

    FetchPosts(1, 30).then(async function(itemKeys) {
        var posts = []
        for (var i = 0; i < itemKeys.length; i++){
            let post = await session.client.hgetallAsync(`post:${itemKeys[i]}`)
            post.site = await session.client.hgetallAsync(`site:${post.site}`)
            store.dispatch(
                {
                    type: "ADD_POST",
                    data: post
                }
            )
        }
        const html = renderToString(
            <Provider store={store}>
                <Application items={store.getState().reverse()} />
            </Provider>
        )
        res.write(renderFullPage(html, preloadedState))
        res.end()
    })
};
function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
            ${renderToString(<Head></Head>)}
            <body class='main'>
                <div id="root">${html}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
                </script>
                <script src="/static/bundle.js"></script>
            </body>
        </html>
        `
}

export { IndexRoute as default }
