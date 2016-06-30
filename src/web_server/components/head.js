import React from 'react'
import Defaults from '../defaults.json'

class Head extends React.Component {
    render(){
        return <head>
            <title>{Defaults.website_name}</title>
            {
                Defaults.stylesheets.map((file, key) => <link href={file.src} rel={"stylesheet"} key={key} />)
            }
            {
                Defaults.scripts.map((file, key)     => <script src={file.src} key={key} />)
            }
        </head>
    }
}

export default Head
