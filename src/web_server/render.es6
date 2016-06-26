import express from 'express'
import path from 'path'
import { renderToString } from 'react-dom/server'
const app = express()

// app.use(function (req, res, next) {
//     const component;
//     res.write(renderToString(component))
//     res.end()
// })
let port = 4444;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());




app.get('/', require('./routes').index);

//Route not found -- Set 404
app.get('*', function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
});





app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
