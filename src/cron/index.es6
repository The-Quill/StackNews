import { GetPostsFromSite } from '../modules/se_api'
import { RedisSession } from '../modules/redis'
import { Time } from '../modules/time'

const session = new RedisSession();
const time    = new Time();

session.client.getAsync('post:last-fetch-date')
.then(async function(res, reply) {
    if (reply === null || time.weekOlder(res)){
        let sites = await session.client.smembersAsync('sites');
        await Promise.all(
            sites.map(async function(site){
                let posts = await GetPostsFromSite(site, null)
                return posts.map(post => updatePost(site, post))
            })
        )
        session.client.setAsync('post:last-fetch-date', time.now)
        return Promise.resolve()
    } else {
        // do last modified magic here
        //
        let sites = await session.client.smembersAsync('sites');
        await Promise.all(
            sites.map(async function(site){
                let posts = await GetPostsFromSite(site, res)
                return posts.map(post => updatePost(site, post))
            })
        )
        session.client.setAsync('post:last-fetch-date', time.now)
        return Promise.resolve()
    }
});
async function updatePost(site, post){
    try {
        await session.client.saddAsync('posts', `${site}:${post.question_id}`);
        await session.client.saddAsync(`posts:${site}`, `${post.question_id}`);
        const postKey = `post:${site}:${post.question_id}`;
        var data = []
        let addData = (...keys) => {
            keys.forEach(key => {
                if (key == null) return
                data.push(key)
                data.push(post[key] || "")
            });
        }
        let addDataPair = (values) => {
            Object.keys(values).forEach(key => {
                if (key == null) return
                data.push(key)
                data.push(values[key] || "")
            })
        }
        addData(
            "title",
            "view_count",
            "answer_count",
            "score",
            "question_id",
            "last_activity_date",
            "creation_date",
            "is_answered",
            "accepted_answer_id",
            "answer_count"
        )
        addDataPair({
            'tags': JSON.stringify(post.tags),
            'owner:ismoderator': post.owner.user_type == "moderator",
            'owner:name': post.owner.display_name,
            'owner:id': post.owner.user_id,
            'owner:image': post.owner.profile_image
        });
        return session.client.hmsetAsync([postKey, ...data])
    } catch (error){
        return Promise.reject(error);
    }
}
