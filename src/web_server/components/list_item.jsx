import React from 'react'

const ListItem = React.createClass({
    getInitialState(){
        console.log(this.props.item);
        return {}
    },
    render () {
        return (
            <div className="list-item">
                <img src={this.props.item['owner:image']} />
                <div className="content">{this.props.item.title}</div>
            </div>
        )
    }
})

export { ListItem as default }
