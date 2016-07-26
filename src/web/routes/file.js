import Route from '../../modules/route'
import debug from '../../modules/debug'
import Path from 'path'

var FileRoute = new Route('File', debug.medium);
FileRoute.router = function(req, res) {
    const { path } = req
    if (path == ""){
        res.write('')
        res.end()
    }
    let file = path.replace(path.substring(0, path.lastIndexOf('/') + 1), '')
    res.sendFile(file, {root: Path.join(__dirname, '../../../dist/web/resources')});
};

export default FileRoute.router
