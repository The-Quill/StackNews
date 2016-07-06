import express from 'express'
import path from 'path'

import IndexRoute from './routes/index'
import CssRoute from './routes/css'
import CssMapRoute from './routes/cssmap'
import ImageRoute from './routes/image'
import TtfRoute from './routes/ttf'

const app = express()
let port = 4444

app.get('/', IndexRoute);
app.get('/[a-zA-Z]+.png', ImageRoute);
app.get('/[a-zA-Z]+.css', CssRoute);
app.get('/[a-zA-Z]+.css.map', CssMapRoute);
app.get('/[a-zA-Z]+.ttf', TtfRoute);

//Route not found -- Set 404
app.get('*', function(req, res) {
    const { path } = req
    console.log(` - Attempted to find variable at path: ${path}`)
    res.json({
        'route': 'Sorry this page does not exist!'
    });
});

app.listen(port);
console.log('Server is up and running at port: ' + port);
