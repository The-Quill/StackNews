let CssRoute = function(req, res){
    res.sendFile('out.css', {root: './dist/web_server/css_modules'});
};

export { CssRoute as default }
