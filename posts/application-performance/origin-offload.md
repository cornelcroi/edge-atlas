---
title: 'Origin Offload'
metaDesc: 'Developers reduce the load on their origin and improve the performance of their web application by increasing the Cache Hit Ratio (CHR) with CloudFront.'
socialImage: static-assets/origin-offload-without-os.png
---
## Overview
Developers reduce the load on their origin and improve the performance of their web application by increasing the Cache Hit Ratio (CHR) with CloudFront. CHR measures the ratio of HTTP requests served from CloudFront cache to the total requests. Requests served from CloudFront cache benefit from better latency (e.g. time to last byte), which making CHR a good indicator of origin offload and application performance. The CHR of a CloudFront distribution can be monitored using the `Cache hit rate` [metric](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional) in CloudWatch. To increase CHR, developers can optimize the configured cache key in CloudFront, TBD TBD

## Increase cache time to live (TTL)
You can [control](
https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) for how long an object is cached in CloudFront using a combination of the Cache-Control header sent by the origin and the [Time to live settings](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) in Cache Policies. Increasing TTLs has a positive impact on CHR, and consequently it's recommended to:
* Configure Cache-Control headers on the origin
* Treat static assets as immutable objects (e.g. `Cache-Control: max-age=31536000, immutable`), and version their URL path (e.g. `/static/app.1be87a.js`) when referenced from HTML.
* Strike the convenient balance between caching HTML, and how much the application can tolerate stale content.

## Optimize cache key settings
The cache key settings using [Cache Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html), dictates whether or not can CloudFront reuse a cached object for a request. An optimized cache key settings results in a 1 to 1 relation between unique cache keys and unique objects. Consider a web application that serves the same `/about.html` regardless of the appended query parameters (e.g. `/about.html?utm_medium=social`). If the cache key is configured to include the `utm_medium` query parameter, CloudFront will cache both urls using two distinct cache keys. This results in two cache misses to the origin, even though both requests are for exactly the same object from the origin perspective, which is a sub-optimal situation. 

The first best practice to optimize cache key settings is to only include in the cache key what varies responses sent by the origin. Good patterns include:
* Configuring separate [Cache Behaviors](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCacheBehavior) for objects that require different cache key settings.
* If query parameters, headers or cookies vary responses at the origin, only include those which actually do (e.g. cookie user_id instead of all cookies).
* Leveraging [Response Polices] in CloudFront to manage CORS, instead of adding CORS headers (e.g. `Origin, Access-Control-Request-Method, Access-Control-Request-Headers`) to the cache key and managing CORS at the origin level.
* Offload access control to the CloudFront using signed URLs, CloudFront Functions or Lambda@Edge, instead of adding Authorization header to the cache key.
* Using [Origin Request Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-origin-requests.html) in CloudFront to send headers to the origin instead of adding it to the cache key.

The second best practice is to normalize values before adding it to the cache key to reduce their cardinality. Good patterns include:
*  Keeping query parameters, when used, in the [same order and with same case](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html#cache-hit-ratio-query-string-parameters)
*  Leveraging CloudFront generated headers such as `CloudFront-Is-Mobile-Viewer` to identify device type instead of adding `User-agent` header tot he cache key.
*  Using CloudFront Functions to apply advanced normalizations. Examples include:
 *  Such as re-ordering and case lowering query parameters 
 *  Serving a version or another of a web page based on the existence of a cookie, instead of adding the cookie to the cache key
 *  Reducing variance when responses vary based on countries, but the same response can be sent for a group of countries
 *  Reducing further the cardinality of Accept-Encoding when compression is needed, and CloudFront device detection headers when multiple ones are used.

## Enable Origin Shield
By default, CloudFront reduces the number of cache misses to the origin by using two macro-layers of caching: One at the PoP level, then another at the Regional Edge Cache (REC) level. A CloudFront PoP is nominally associated to one of the 10+ RECs globally. When a request results in a cache miss at the PoP level, CloudFront checks the cache of the associated REC to fulfill the request, and only if it's not that the REC cache, the request is fulfilled directly from the origin. However, RECs are isolated from each other to maintain high availability, which means that they do not share their caches. In consequence, in case of popular object being requested from different locations around the world, CloudFront will send multiple requests for the same objects, but from different RECs, to the origin.

![](/static-assets/origin-offload-without-os.png)

To reduce this number of requests, developers can enable Origin Shield on CloudFront, which is a third layer of caching in front of RECs. Instead of requesting objects from the origin directly, RECs try to fulfill the request from the Origin Shield cache before. If the object is not in the Origin Shield cache, the Origin Shield layer will fill the request from the origin, and serve downstream RECs.

![](/static-assets/origin-offload-with-os.png)

## Improve application behavior
On the application side, there are things that you can consider to positively influence the cache hit ratio. The first one is similar to reducing the cardinality of the cache key, but on the application level. When your application produces multiple renditions of the same asset, for example different sizes of an image to fit different screen, consider lowering down the number the possible values for width and height.

Another technique for increasing CHR, but this time at the browser level, is to leverage the browser caching. This can be done using the `Cache-Control` header. You can differentiate TTLs between CloudFront and the browser either using `max-age` with `s-maxage` of the `Cache-Control` header, or simply use the `Cache-Control` header for the browser and control CloudFront TTLs using Cache Policies.