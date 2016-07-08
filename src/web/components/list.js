import React from 'react'
import { connect } from 'react-redux'
import ListItem from './list_item'

class List extends React.Component {
    render () {
        console.log(`Called list to render`)
        console.log(this.props)
        return (
            <div className="list">
                {
                    this.props.items.map(
                        (item, index) => <ListItem item={item} key={index}></ListItem>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state = {items: []}) {
    return { items: state }
}

export default connect(mapStateToProps)(List)
