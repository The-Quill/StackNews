import React from 'react'
import HtmlEntities from 'html-entities'

const entities = new HtmlEntities.AllHtmlEntities();

const ListItem = React.createClass({
    getInitialState(){
        //console.log(this.props.item);
        return {}
    },
    render () {
        return (
            <div className="list-item">
                <img src={this.props.item['owner:image']} />
                <div className="content">{entities.decode(this.props.item.title)}</div>
            </div>
        )
    }
})

export default ListItem
