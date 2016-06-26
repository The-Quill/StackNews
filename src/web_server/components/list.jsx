import React from 'react'
import ListItem from './list_item'

const List = React.createClass({
    render () {
        return (
            <div>
                {
                    this.props.items.map(
                        item => <ListItem item={item}></ListItem>
                    )
                }
            </div>
        )
    }
})

export { List as default }
