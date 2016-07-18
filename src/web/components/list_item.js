import React from 'react'
import HtmlEntities from 'html-entities'

const entities = new HtmlEntities.AllHtmlEntities();

const ListItem = React.createClass({
    getInitialState(){
        //console.log(this.props.item);
        return {}
    },
    render () {        //
        let isModPost = this.props.item['owner:ismoderator'] === 'true'
        return (
            <div className={`list-item ${isModPost ? 'moderatorPost' : ''}`}
                 title={`This is a post from a ${isModPost ? 'moderator' : 'user'}.`}>
                <div className={`post-details`}>
                    <img className="site-icon"
                        src={this.props.item.site.icon_url}
                        title={this.props.item.site.name}
                        alt={this.props.item.site.name}
                    />
                    <span>
                        <a target="_blank" href={
                            `${this.props.item.site['site_url']}/q/${this.props.item.question_id}`
                        } className="content">
                            {entities.decode(this.props.item.title)}
                        </a>
                    </span>
                </div>
                <div className={`user-details`}>
                    <a href={this.props.item['owner:link']}>{entities.decode(this.props.item['owner:name'])}{isModPost ? '♦' : ''}</a>
                    <img className="user-icon" src={this.props.item['owner:image']} />
                </div>
            </div>
        )
    }
})

export default ListItem

// Insert after `div div span`
// <br></br>
// {
//     JSON.parse(this.props.item.tags).map((tag, index) => <span className="tag" key={index}>{tag}</span>)
// }
