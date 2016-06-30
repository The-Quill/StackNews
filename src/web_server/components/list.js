import React from 'react'
import ListItem from './list_item'

class List extends React.Component {
    render () {
        return (
            <div>
                {
                    this.props.items.map(
                        (item, index) => <ListItem item={item} key={index}></ListItem>
                    )
                }
            </div>
        )
    }
}

export default List
