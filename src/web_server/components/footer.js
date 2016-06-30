import React from 'react'
import Defaults from '../defaults'

class Footer extends React.Component {
    render(){
        return <footer>
            <img src={Defaults.icon_url} />
            <h1>{Defaults.website_name}</h1>
        </footer>
    }
}

export default Footer
