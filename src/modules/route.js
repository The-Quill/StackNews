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
            if (that.log){
                let { path } = req
                console.log(`${that.name}: - Access attempt on variable at path: ${path}`)
            }
            that._router(req, res)
        }
    }
}
export default Route
