import { GetSiteList, GetMetaSites, GetPostsFromMeta } from './modules/se_api'
import { RedisSession } from './modules/redis'
import { Time } from './modules/time'

const session = new RedisSession();
const time    = new Time();

session.client.getAsync('site:last-fetch-date')
.then(async function(res, reply) {
    if (reply === null || time.weekOlder(res)){
        await updateMetaSites();
        session.client.setAsync('site:last-fetch-date', time.now)
        return Promise.resolve()
    } else {
        var sites = await session.client.smembersAsync('sites');
        console.log("got sites");
        sites.forEach(site => console.log(` - ${site}`))
        return Promise.resolve()
    }
});
async function updateMetaSite(site){
    await session.client.saddAsync('sites', site.api_site_parameter);
    const postKey = `site:${site.api_site_parameter}`;
    var data = []
    let addData = (...keys) => {
        keys.forEach(key => {
            if (key == null) return
            data.push(key)
            data.push(site[key] || "")
        });
    }
    addData(
        "high_resolution_icon_url",
        "icon_url",
        "favicon_url",
        "logo_url",
        "api_site_parameter",
        "name"
    )
    return session.client.hmsetAsync([postKey, ...data])
}