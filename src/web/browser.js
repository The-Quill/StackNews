import PostsReducer from './reducers/posts'
import ReactDOM from 'react-dom'
import React from 'react'
import { Application } from './components'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import 'whatwg-fetch';
window.React = React

var currentlyLoading = false;
var currentPage = 1;
var store = createStore(PostsReducer)
ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('root')
)
store.subscribe(() => {
    ReactDOM.render(
        <Provider store={store}>
            <Application />
        </Provider>,
        document.getElementById('root')
    )
})
function addPosts(data){
    let posts = data.posts;
    posts.forEach(post => store.dispatch(
        {
            type: "ADD_POST",
            data: post
        }
    ))
    currentlyLoading = false;
}
function getNew(){
    currentlyLoading = true;
    fetch(`/data/${currentPage++}`)
    .then(response => response.json().then(addPosts))
}
window.addEventListener('scroll', function(event){
    var element = event.target;
    if (element.scrollHeight == null){
        element = element.scrollingElement;
    }
    let percentScrolled = (element.scrollTop / element.clientHeight) * 100;
    if (percentScrolled > 87 && !currentlyLoading){
        getNew()
    }
});
getNew()
