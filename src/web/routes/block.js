import Route from '../../modules/route'
import debug from '../../modules/debug'

var BlockRoute = new Route('Block', debug.high);
BlockRoute.router = function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
}
export default BlockRoute.router
