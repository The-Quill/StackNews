import { GetPostsFromSite } from '../modules/se_api'
import { RedisSession } from '../modules/redis'
import { Time } from '../modules/time'
import debug from '../modules/debug'

const session = new RedisSession();
const time    = new Time();

try {
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
        } else {
            debug.important(`Getting updated data...`)
            // do last modified magic here
            //
            let sites = await session.client.smembersAsync('sites');
            await Promise.all(
                sites.map(async function(site){
                    let posts = await GetPostsFromSite(site, res)
                    return posts.map(post => updatePost(site, post))
                })
            )
        }
        await session.client.setAsync('post:last-fetch-date', time.now)
        debug.important(`Finishing job.`)
        process.exit()
    });
} catch(error){
    throw new Error(error)
}

async function updatePost(site, post){
    try {
        const postKey = `post:${site}:${post.question_id}`;
        var data = []
        let addData = (...keys) => {
            keys.forEach(key => {
                if (key == null) return
                let value = post[key] === null || post[key] === undefined
                    ? ""
                    : post[key]
                data.push(key)
                data.push(value)
            });
        }
        let addDataPair = (values) => {
            Object.keys(values).forEach(key => {
                if (key == null) return
                let value = values[key] === null || values[key] === undefined
                    ? ""
                    : values[key]
                data.push(key)
                data.push(value)
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
            "answer_count",
            "share_link"
        )
        addDataPair({
            'site': site,
            'tags': JSON.stringify(post.tags),
            'owner:ismoderator': post.owner.user_type == "moderator",
            'owner:reputation': post.owner.reputation,
            'owner:name': post.owner.display_name,
            'owner:id': post.owner.user_id,
            'owner:image': post.owner.profile_image,
            'owner:link': post.owner.link
        });
        data.forEach(item => {
            if (item === undefined){
                throw new Error('data point was undefined')
            }
        })
        await session.client.hmsetAsync([postKey, ...data])
        return Promise.all([
            () => session.client.saddAsync(`posts:${site}`, `${post.question_id}`),
            () => session.client.zaddAsync('posts', post.creation_date, `${site}:${post.question_id}`)
        ]);
    } catch (error){
        console.error(error)
        return Promise.reject(error);
    }
}
