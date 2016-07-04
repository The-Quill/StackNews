let CssRoute = function(req, res){
    res.sendFile('out.css.map', {root: './dist/web_server/scss'});
};

export { CssRoute as default }
