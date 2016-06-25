import { GetSiteList, GetMetaSites, GetPostsFromMeta } from './modules/se_api'
import { RedisSession } from './modules/redis'
import moment from 'moment'

var session = new RedisSession();

var now = moment().valueOf();

const time = {
    is: {
        before: (first, second) => {
            return moment(+first).isBefore(+moment)
        },
        after: (first, second) => {
            return moment(+first).isAfter(+moment)
        }
    },
    isA: {
        weekOlder: (first, second) => {
            return moment(+first).add(7, 'days').isAfter(moment(+second))
        },
        dayOlder: (first, second) => {
            return moment(+first).add(1, 'days').isAfter(moment(+second))
        }
    }
}

session.client.getAsync('site:last-fetch-date')
.then(async function(res, reply) {
    console.log(reply === null)
    console.log(time.isA.weekOlder(res, now))
    if (reply === null || time.isA.weekOlder(res, now)){
        await updateMetaSites();
        session.client.setAsync('site:last-fetch-date', now)
    } else {
        console.log(2)
        var sites = await session.client.getAsync('sites');
        console.log("got sites");
        sites.forEach(site => console.log(` - site`))
    }
});

async function updateMetaSites(){
    try {
        let sites = await GetMetaSites();
        return Promise.all(sites.map(async function(site){
            await session.client.saddAsync('sites', site.api_site_parameter);
            const key = `site:${site.api_site_parameter}`;
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
            return session.client.hmsetAsync([key, ...data])
        }))
    } catch (error){
        return Promise.reject(error)
    }
}
