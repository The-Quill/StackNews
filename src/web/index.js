import express from 'express'
import path from 'path'

import DataRoute from './routes/data'
import FileRoute from './routes/file'
import IndexRoute from './routes/index'
import BlockRoute from './routes/block'
import FourOhFourRoute from './routes/404'

import Defaults from './defaults'

const app = express()
let port = 4444

app.get('/', IndexRoute);
app.get('/data/:page', DataRoute);

app.get('/render.js', FileRoute);

Defaults.allowedFileExtensions.forEach(
    extension => app.get(`/[a-zA-Z]+.${extension}`, FileRoute)
)
Defaults.bannedFileExtensions.forEach(
    extension => app.get(`/[a-zA-Z]+.${extension}`, BlockRoute)
)

app.get('*', FourOhFourRoute);
app.listen(port);

console.log('Server is up and running at port: ' + port);
