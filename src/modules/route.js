import debug from './debug'
import defaults from '../../web.config.json'
import otherDefaults from '../web/defaults.json'
import { Time } from './time'

class Route {
    constructor(name, log = debug.high){
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
                res.set("Connection", "close");
                res.set('Proof', 'close');
                var video = otherDefaults.youtubeVideosToRedirectTo[
                    Math.floor(Math.random() * otherDefaults.youtubeVideosToRedirectTo.length)
                ]
                res.send(`<script>document.location = '${video}'</script>`);
                return;
            }
            if (that.log){
                let { path } = req
                that.log(`[${new Time().timestamp}] ${that.name} - Attempt at path: ${path}`)
            }
            that._router(req, res)
        }
    }
}
export default Route
