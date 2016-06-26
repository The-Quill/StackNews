import React from 'react'
import { List } from '../components.es6'

var Index = React.createClass({
    render(){
        return <div>
            <List items={this.props.items}></List>
        </div>
    }
})

export { Index as default }
