import Route from '../../modules/route'
import debug from '../../modules/debug'

var FourOhFourRoute = new Route('FourOhFour', debug.high);
FourOhFourRoute.router = function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
}
export default FourOhFourRoute.router
