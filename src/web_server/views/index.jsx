import React from 'react'
import { Head, Header, List, Footer } from '../components.es6'
import styles from '../css_modules/body.css'

var Application = React.createClass({
    render(){
        return <html>
            <Head></Head>
            <body className={styles.body}>
                <Header></Header>
                <List items={this.props.items}></List>
                <Footer></Footer>
            </body>
        </html>
    }
})

export { Application as default }
