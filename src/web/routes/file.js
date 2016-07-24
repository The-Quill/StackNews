import Route from '../../modules/route'
import path from 'path'

var FileRoute = new Route('File', true);
FileRoute.router = function(req, res) {
    const { path } = req
    if (path == ""){
        res.write('')
        res.end()
    }
    let file = path.replace(path.substring(0, path.lastIndexOf('/') + 1), '')
    res.sendFile(file, {root: path.join(__dirname, './dist/web/resources')});
};

export default FileRoute.router
