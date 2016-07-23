import debug from './debug'
import defaults from '../../web.config.json'
class Route {
    constructor(name, log){
        this.log = log;
        this.name = name;
    }
    set router(router){
        this._router = router;
    }
    get router(){
        var that = this;
        return (req, res) => {
            let proxyIP = req.ip;
            if (proxyIP.replace('::ffff:', '') != defaults.haproxy.IP){
                return res.set("Connection", "close");
            }
            if (that.log){
                let { path } = req
                debug.high(`${that.name}: - Access attempt on variable at path: ${path}`)
            }
            that._router(req, res)
        }
    }
}
export default Route
