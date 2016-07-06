import React from 'react'
import { Head, Header, List, Footer } from '../components'

class Application extends React.Component {
    render(){
        return <html>
            <Head></Head>
            <body className={'main'}>
                <Header></Header>
                <List items={this.props.items || []}></List>
                <Footer></Footer>
            </body>
        </html>
    }
}


export default Application
