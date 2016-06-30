let ImageRoute = function(req, res){
    const { path } = req
    let file = path.replace(path.substring(0, path.lastIndexOf('/') + 1), '')
    res.sendFile(file, {root: './dist/web_server/resources'});
};

export { ImageRoute as default }
