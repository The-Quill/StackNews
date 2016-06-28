import React from 'react'
import Defaults from '../defaults'

var Header = React.createClass({
    render(){
        return <nav>
            <img src={Defaults.icon_url} />
            <h1>{Defaults.website_name}</h1>
        </nav>
    }
})

export { Header as default }
