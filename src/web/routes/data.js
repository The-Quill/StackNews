import Route from '../../modules/route'
import { LoadNewPosts } from '../../modules/se_api'


var DataRoute = new Route('Data', true);
DataRoute.router = async function(req, res) {
    let { page } = req.params;
    let count = 30;
    try {
        let posts = await LoadNewPosts(page, count);
        res.json({ posts: posts });
    } catch(error){
        throw new Error(error);
    }

}
export default DataRoute.router
