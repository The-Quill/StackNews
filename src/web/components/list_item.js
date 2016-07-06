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
            <div className={`list-item ${this.props.item['owner:ismoderator'] ? 'moderatorPost' : ''}`}>
                <div>
                    <span className="score">
                        {this.props.item.score || 0}
                    </span>
                    <img className="site-icon" src={this.props.item.site.icon_url} />
                    <a target="_blank" href={
                        `${this.props.item.site['site_url']}/q/${this.props.item.question_id}`
                    } className="content">
                        {entities.decode(this.props.item.title)}
                    </a>
                </div>
                <div>
                    <span>  posted by {this.props.item['owner:name']}</span>
                    <img className="user-icon" src={this.props.item['owner:image']} />
                </div>
            </div>
        )
    }
})

export default ListItem
