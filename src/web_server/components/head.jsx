import React from 'react'
import Defaults from '../defaults'

const Head = React.createClass({
    render(){
        return <head>
            <title>{Defaults.website_name}</title>
            {
                Defaults.stylesheets.map((file, key) => <link href={file.src} key={key} />)
            }
            {
                Defaults.scripts.map((file, key)     => <script src={file.src} key={key} />)
            }
        </head>
    }
})

export { Head as default }
