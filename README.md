# [StackNews][sn]
A platform for viewing the new Meta posts from Stack Exchange.
---

Stack Exchange is an amazing network of sites, so it makes sense that you'd want to know about what's going on in each of the sites.

Which is kinda hard when there's over 150 of them! This is where StackNews comes in.

By hourly fetching the new meta posts from every site, StackNews can present the latest meta posts from the entire Stack Exchange network in one dead simple, no BS feed:

![][photo]

---
#How do we get started?

Just visit [stacknews.org][sn] in your browser.

---
#How does it work?

StackNews is powered by:

 - [Node.js][node]
 - [React][react] and [Redux][redux].
 - [Express][express]
 - [Redis][redis]
 - [HAProxy][haproxy]
 - [Stack Exchange API][se_api]

For more information, read the blog post [here][blog_post] I wrote which goes into more detail.

---
#License

This project is licensed under the MIT License.

[sn]:http://stacknews.org
[photo]:http://i.stack.imgur.com/TCkXn.png
[react]:https://facebook.github.io/react/
[redux]:http://redux.js.org/
[blog_post]:example.com
[haproxy]:http://www.haproxy.org/
[redis]:http://redis.io/
[express]:https://expressjs.com/
[node]:https://nodejs.org/en/
[se_api]:http://api.stackexchange.com
