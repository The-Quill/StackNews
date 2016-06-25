import { GetSiteList, GetMetaSites, GetPostsFromMeta } from './modules/se_api'
import { RedisSession } from './modules/redis'
import { Time } from './modules/time'

const session = new RedisSession();
const time    = new Time();

session.client.getAsync('post:last-fetch-date')
.then(async function(res, reply) {
    if (reply === null || time.weekOlder(res)){
        let sites = await session.client.smembersAsync('sites');
        await Promise.all(
            sites.map(async function(site){
                (await GetPostsFromMeta(site, null))
                .map(post => updatePost(site, post))
            })
        )
        session.client.setAsync('post:last-fetch-date', time.now)
        return Promise.resolve()
    } else {
        // do last modified magic here
        //
        await Promise.all(
            sites.map(async function(site){
                (await GetPostsFromMeta(site, res))
                .map(post => updatePost(site, post))
            })
        )
        session.client.setAsync('post:last-fetch-date', time.now)
        return Promise.resolve()
    }
});
async function updatePost(site, post){
    await session.client.saddAsync('posts', `${site}:${post.question_id}`);
    await session.client.saddAsync(`posts:${site}`, `${post.question_id}`);
    const postKey = `post:${site}:${post.question_id}`;
    var data = []
    let addData = (...keys) => {
        keys.forEach(key => {
            if (key == null) return
            data.push(key)
            data.push(site[key] || "")
        });
    }
    addData(
        "title",
        "view_count",
        "answer_count",
        "score",
        "question_id",
        "name",
        "last_activity_date",
        "creation_date",
        "is_answered",
        "accepted_answer_id",
        "answer_count"
    )
    data.push("tags")
    data.push(JSON.stringify(result.tags))
    data.push("owner:ismoderator")
    data.push(result.owner.user_type == "moderator")
    data.push("owner:name")
    data.push(result.owner.display_name)
    data.push("owner:id")
    data.push(result.owner.user_id)
    data.push("owner:image")
    data.push(result.owner.profile_image)
    console.log(data);
    return session.client.hmsetAsync([postKey, ...data])
}
