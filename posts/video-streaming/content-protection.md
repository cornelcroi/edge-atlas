---
title: 'Content Protection'
metaDesc: 'Controlling access to video content is one of the top priorities for media companies. Without such capabilities, they risk online piracy with considerable impact to their business: Loss of revenues and legal liabilities towards content right holders.'
socialImage: static-assets/content-protection-smd.png
---
## Overview
Controlling access to video content is one of the top priorities for media companies. Without such capabilities, they risk online piracy with considerable impact to their business: Loss of revenues and legal liabilities towards content right holders.

## Common use cases

### Geo-blocking
You might have rights to stream content in specific countries. To block users from other countries, check [the different geo-blocking options](TODO) using CloudFront, WAF and CloudFront Functions. In addition, you can block users from overcoming geo-fencing using VPNs, by using AWS WAF with the [Anonymous IP List Managed Rule](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html#aws-managed-rule-groups-ip-rep-anonymous). You can also consider the [IP Fraud Detection and Prevention](https://aws.amazon.com/marketplace/pp/prodview-o4j74botqfjks) Managed rule for WAF.

### Simple tokenization solution for web based clients
When you have a web browser user base, and want a simple tokenization mechanism to block unauthorized users from streaming your content, consider using CloudFront's native [signed cookie](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-cookies.html). This feature in CloudFront doesn't have any additional charge. When the user is authenticated tp stream video on your web application, your backend will set a cookie on the user browser that contains the signed token. Subsequent requests from the player will contain the signed cookie, and will be authorized by CloudFront. Follow the steps in this blog series ([1](https://aws.amazon.com/blogs/media/part-1-protecting-your-video-stream-with-amazon-cloudfront-and-serverless-technologies/) & [2](https://aws.amazon.com/blogs/media/part-2-protecting-your-video-stream-with-amazon-cloudfront-and-serverless-technologies/)) for a sample tokenization or video streaming using CloudFront.

### Advanced tokenization solution
For advanced use cases, with a heterogeneous user device base (Set Top Boxes, Smart TVs), and more sophisticated requirements for tokenization logic, deploy the [Secure Media Delivery](TODO) solution. It's tokenization solution based on CloudFront Functions, with the following benefits:
* The token is part of the path, which doesn't require modification on the client or server side in your video workflow.
* The signature is customizable, to include different dimensions such as IP, Country, User Agent header, etc..
* A session revocation mechanism completes the solution to identify and block pirated sessions within minutes.

Note that the solution provides you with an SDK to generate tokens.

![](/static-assets/content-protection-smd.png)

## Additional resources
* TODO link to secure media delivery solution when published
* TODO update blog
* TODO link to geo-blocking page