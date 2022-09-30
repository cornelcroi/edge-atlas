---
title: 'Cost Optimization'
metaDesc: "On top of it's performance, security and availability benefits, CloudFront is a recommended component to reduce the costs of web applications."
socialImage: static-assets/thumbnail-edge.png
---
## Overview
On top of it's performance, security and availability benefits, CloudFront is a recommended component to reduce the costs of web applications. 

## CloudFront's pricing
[CloudFront's pricing model](https://aws.amazon.com/cloudfront/pricing/) has multiple components to it. However, the dominant components are:
* The Regional Data Transfer Out (DTO) to Internet, which accounts for the amount of GBs served by CloudFront to users on the internet. Note that this pricing depend on the region of users, it's metered using binary gigabytes (i.e. 1 GB is 1024 MB and so on), and its DTO only includes the HTTP payload (e.g. excluding TLS handshake overhead). If you want to use the cheapest regions for delivering traffic (at the expense of decreased performance), consider [Price Class](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html) options in CloudFront. 
* The request fee, which also depends on the region of the user, accounts for the number of HTTP(S) requests served by CloudFront.

CloudFront has an always on Free tier, that includes every month 1 TB of DTO and 10 Million HTTP(S) requests. If you are using AWS WAF in combination with CloudFront, you can save up to 30% on the CloudFront charges on your AWS bill when you make an upfront commitment with the [CloudFront security savings bundle](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/savings-bundle.html). For larger volumes (10TB+), you can contact AWS to sign a private pricing agreement to benefit further reductions in return of financial commitment. Note that higher is the average size of your HTTP payloads, the better discount you can get. Using CloudFront with multiple workloads (API delivery and static file delivery) can increase the value of the average HTTP payload size, which reduces the overall price of your content delivery.

Finally, when you are using an AWS based origin with CloudFront, you do not pay the Data Transfer Out (DTO) of this service anymore. CloudFront's DTO replaces the AWS origin DTO.

## CloudFront configuration optimization
CloudFront reduces the your content delivery cost in different ways:
* CloudFront serve cacheable requests from its own cache, which offloads your origin and reduces its scaling cost. You can optimize your CloudFront configuration to increase your Cache Hit Ratio and in consequence the costs of your origin. For example, Origin Shield is a native feature of CloudFront that can simply reduce the amount of requests going back to your origin.
* For dynamic content, such as API traffic, CloudFront reuses TCP/TLS connections to the origin, which reduces the number of new connections that needs to be handled by the origin. Reducing the number of connections to the origin also reduces the amount of TLS certificates sent by the origin, which in certain cases such as APIs with small HTTP payloads, can represent a significant overhead. For example, in ALB, CloudFront will have a positive impact on decreasing [LCU](https://aws.amazon.com/elasticloadbalancing/pricing/) thanks to the reduced number of newly established connections per second and the number of bytes processed.

On your side, you can optimize your CloudFront configuration further to reduce its costs:
* If you are using Edge computing capabilities, prefer using CloudFront Functions (instead of Lambda@Edge) when applicable because it's less expensive. If you are using Lambda@Edge consider the guidance in [this blog](https://aws.amazon.com/blogs/networking-and-content-delivery/lambdaedge-design-best-practices/) to optimize its costs. Finally, regardless of what flavor of Edge computing you are using, enable it on the most specific cache behavior to avoid unnecessary executions.
* Avoid using Invalidations as part of your normal operations, and use instead standard Cache-Control header to control the freshness of your cache. Not only Invalidations do not have effect on browser caching, and are less reliable, they also have cost beyond 1000 invalidations per month. USe invalidations for break glass scenarios.

## Application optimization
On the application side, you can implement many optimizations to reduce the cost of your delivery with CloudFront:
* Reduce un-necessary delivered requests. Examples include:
    * Using Adaptive Bit Rate streaming instead of progressive downloads for video delivery allow you to sent only the required bytes by the video player.
    * Lazy loading assets on your website, such as images, to avoid downloading them if not consumed by the user.
    * Using Same Origin Policy when possible, to avoid sending preflight CORS OPTION requests.
*  Reduce delivered bytes. For example you can compress your objects in different formats and serve the most optimal format for a user device. For example, serve Avif or WebP images to devices that support it because they are more compressed that jpeg. You can compress your text files using GZIP/Brotli by either configuring CloudFront to do it automatically, or do it on the origin side.










