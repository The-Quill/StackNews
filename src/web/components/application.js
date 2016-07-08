import React from 'react'
import { connect } from 'react-redux'
import { Head, Header, List, Footer } from '../components'

class Application extends React.Component {
    render(){
        return <div>
            <Header></Header>
            <List items={this.props.items || []}></List>
            <Footer></Footer>
        </div>
    }
}

function mapStateToProps(state = {items: []}) {
    return { items: state }
}

export default connect(mapStateToProps)(Application)
