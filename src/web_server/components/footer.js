import React from 'react'
import Defaults from '../defaults'

class Footer extends React.Component {
    render(){
        return <footer>
            <img src={Defaults.icon_url} />
            <p>{Defaults.website_name}</p>
        </footer>
    }
}

export default Footer
