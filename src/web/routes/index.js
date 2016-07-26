import React from 'react'
import Route from '../../modules/route'
import debug from '../../modules/debug'
import { renderToString } from 'react-dom/server'
import { Application, Head } from '../components'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import PostsReducer from '../reducers/posts'

let IndexRoute = new Route('Index', debug.low)
IndexRoute.router = function(req, res){
    const store = createStore(PostsReducer)
    const preloadedState = store.getState()
    const html = renderToString(
        <Provider store={store}>
            <Application />
        </Provider>
    )
    res.write(renderFullPage(html, preloadedState))
    res.end()
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
                <script src="/render.js"></script>
            </body>
        </html>
        `
}

export default IndexRoute.router
