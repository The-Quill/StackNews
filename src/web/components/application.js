import React from 'react'
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


export default Application
