let TtfRoute = function(req, res){
    const { path } = req
    let fileName = path.substring(path.lastIndexOf('/') + 1, path.length)
    res.sendFile(fileName, {root: './dist/web_server/resources'});
};

export { TtfRoute as default }
