import { RedisSession } from '../../modules/redis.es6'
// async function getPosts(){
//     return await getPostsOrSomething();
// }
let IndexRoute = function(req, res){
    //let items = await getPosts();
    let items = [
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        },
        {
            'owner:image': 'a.png',
            'title': 'Test'
        }
    ]
    res.render('index', {
        items: items,
    });
};

export { IndexRoute as default }
