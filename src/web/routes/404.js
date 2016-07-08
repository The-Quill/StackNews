import Route from '../../modules/route'

var FourOhFourRoute = new Route('FourOhFour', true);
FourOhFourRoute.router = function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
}
export default FourOhFourRoute.router
