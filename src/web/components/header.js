import React from 'react'
import Defaults from '../defaults'

class Header extends React.Component {
    render(){
        return <nav>
            <h1>{Defaults.website_name}</h1>
        </nav>
    }
}

export default Header
