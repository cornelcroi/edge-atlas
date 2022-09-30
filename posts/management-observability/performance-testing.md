---
title: 'Performance Testing'
metaDesc: 'Developers benchmark the performance of their content delivery networks for multiple purposes.'
socialImage: static-assets/thumbnail-edge.png
---
## Overview
Developers benchmark the performance of their content delivery networks for multiple purposes. Performance testing scenarios include assessing a CDN’s performance before rolling it out to production (new application or changing CDN), or in the case of a multi-CDN delivery approach, continuously compare the performance of each CDN to send traffic to the most performing one. 

## Real User Monitoring
When you want to measure and compare the performance of CloudFront, it's recommended to start with a Real User Monitoring solution (RUM) like [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html). RUM Gives you the most accurate data about how your application is performing from the user perspective. For example, you can base your benchmarking logic on Google Core Web Vitals metrics, that correlate strongly with business KPIs and SEO of your web application.

To benchmark CloudFront, it's recommended to
* Send significant portion of your traffic (20% at minima) to CloudFront, to measure the actual performance you'd see in full scale production. When CloudFront is warmed (e.g. cache populated, TCP connection pool warmed, and DNS entries cached by ISPs), its performance is improved. Measuring the performance of CloudFront when it's not warmed, does'nt reflect the reality of production.
* Avoid synthetic testing when possible. In fact, Synthetic testing is usually done from Cloud data centers or backbone networks, which does not represent ISP networks with real users. CloudFront's routing is optimized for networks carrying real user traffic, and when requests come from other types of networks (like Datacenters), CloudFront might not route requests to the most optimal PoP, which leads to sub-optimal measured performance. Also,avoid traditional [load testing](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/load-testing.html) CloudFront from a handful of Datacenter servers.
* Conduct the benchmarking testing in the same conditions. Ideally, you'd send the same amount of traffic to each of your CDN, in the same time, to the same user base, and with similar configured capabilities.

Read this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/measuring-cloudfront-performance/) for additional recommendations when it comes to performance testing.

## 3rd Party CDN switching
Some companies consider CDN benchmarking and switching tools such as NS1 and Citrix (formerly Cedexis). Consider the following recommendations when using these 3rd party tools:
* Some of these tools offer public community measurements. They actually set up a CDN configuration with major CDNs, and then set up javascript tags in popular websites, to collect network level information about how each CDN is behaving. While it's a simple method to get started with, however, it's not an accurate approach. CDNs might be configured in a different way than in your application, and the user base of these popular website can be different than yours.
* It's more recommended to use private measurements of your own web application across your different CDNs. When you do that, make sure that:
    * The traffic level is enough to warm CDNs and see their real performance
    * The tested objects characteristics is similar to your application (e.g. Static vs Dynamic, small object vs large object, etc...)
    * The considered benchmarking metrics cover availability, throughput and latency in proportions that makes sens to your application.
