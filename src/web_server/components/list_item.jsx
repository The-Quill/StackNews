import React from 'react'

const ListItem = React.createClass({
    render () {
        return (
            <div className="avatar single">
                <img src={this.props.user.image} />
                <div className="username small">{this.props.user.name}</div>
            </div>
        )
    }
})

export { ListItem as default }
