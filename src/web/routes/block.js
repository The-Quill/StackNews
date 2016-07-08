import Route from '../../modules/route'

var BlockRoute = new Route('Block', true);
BlockRoute.router = function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
}
export default BlockRoute.router
