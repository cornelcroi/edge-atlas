---
title: 'Edge fundamentals'
metaDesc: 'An introduction to AWS edge services'
socialImage: static-assets/fundamentals-edge-thumb.png
---
## Overview
An AWS Region is a physical location where AWS clusters data centers and operates regional services, like EC2 and S3. In the specific case of online applications, user traffic may traverse multiple public networks to reach a regional infrastructure. Customers who want to address the drawbacks of traversing uncontrolled networks in terms of performance, reliability and security should consider adding AWS edge services to their architectures. AWS edge services like Amazon CloudFront and AWS Global Accelerator, operate across hundreds of worldwide distributed Points of Presence (PoPs) outside of AWS Regions. Users are served from these PoPs within 20 to 30 milliseconds on average, and, when needed, their traffic is carried back to customers’ regional infrastructure over the AWS global network instead of going over the public internet. The AWS Global Infrastructure is a purpose-built, highly available, and low-latency private infrastructure built on a global, fully redundant, metro fiber network that is linked via terrestrial and trans-oceanic cables across the world. For more details about this topic, read this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/well-architecting-online-applications-with-cloudfront-and-aws-global-accelerator/)

## CloudFront, the CDN of AWS
Amazon CloudFront is Amazon’s Content Delivery Network (CDN). To use this service, create a CloudFront distribution, configure your origin (any origin that has a publicly accessible domain name), attach a valid TLS certificate using Amazon Certificate Manager, and then configure your authoritative DNS server to point your web application’s domain name to the distribution’s generated domain name (xyz.cloudfront.net). During the DNS resolution phase, when users navigate to the web application, the HTTP(S) request is dynamically routed to the best CloudFront PoP in terms of latency and availability. Once the PoP is selected, the user terminates the TCP connection, including the TLS handshake, on one of the PoP’s servers, and then sends the HTTP request. If the content is cached in one of the cache layers of CloudFront, the request will be fulfilled locally by CloudFront. Otherwise, the request is forwarded to the origin. 

![](/static-assets/fundamentals-edge-cloudfront.png)

CloudFront is formed by two layers:
* Edge locations, where connections are terminated. They provide caching capabilities, execute CloudFront Functions if configured, and apply WAF rules if configured. Finally, DDoS protection is enforced at this level.
* Regional Edge caches are caches hosted in AWS regions, that provide higher cache width which reduce load on the origin. If configured, Lambda@Edge functions are exectued at this level.

Note that HTTP requests travel through these layers in different ways according to the nature of the request. For example, dynamic requests, such as when CloudFront is configured as reverse proxy, skip caching layers. Also note the following order of executing logic through CloudFront layers:
1. CloudFront native security controls, such as TLS policy, HTTP to HTTPS redirection, Geoblocking, Signed URLs, etc..
2. WAF
3. Edge functions configured on Viewer request event
4. Caching
5. Edge functions configured on Origin request event
6. Origin

## Global Accelerator, an acceleration at network level
AWS Global Accelerator is a networking service that improves the performance, reliability and security of your online applications using AWS Global Infrastructure. AWS Global Accelerator can be deployed in front of your Network Load Balancers, Application Load Balancers, AWS EC2 instances, and Elastic IPs, any of which could serve as Regional endpoints for your application. To use this service, create an accelerator, which provides two global static anycast IPv4 addresses that act as a fixed entry point to your application. With Global Accelerator, you can have multiple application endpoints present in single or multiple AWS Regions but they can all be accessed by the same anycast IP address. You then configure your authoritative DNS server to point your web application’s domain name to the accelerator’s dedicated static IPs. These anycast IPs are announced across all Global Accelerator PoPs to route user traffic to the nearest PoP, and then forward them to the regional endpoint over the AWS global network. 