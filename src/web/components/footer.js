import React from 'react'
import Defaults from '../defaults'

class Footer extends React.Component {
    render(){
        return <footer>
            <img src={Defaults.icon_url} />
            <p>Made with love by <a href="http://codequicksand.com">Quill</a>. Powered by NodeJS, React, Redis and Express. Content belongs to relevant post authors from the Stack Exchange network.</p>
        </footer>
    }
}

export default Footer
