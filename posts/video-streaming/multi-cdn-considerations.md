---
title: 'Multi-CDN considerations'
metaDesc: 'As you develop and scale your architecture for media streaming, a multi-CDN approach might seem appealing. The driver for this is often a desire for more aggregate capacity, wider coverage in different geographies, or improving resilience and performance.'
socialImage: static-assets/multi-cdn-considerations-os.png
---
## Overview
As you develop and scale your architecture for media streaming, a multi-CDN approach might seem appealing. The driver for this is often a desire for more aggregate capacity, wider coverage in different geographies, or improving resilience and performance. 

## Multi-CDN strategy
First, you need to decide whether a multi-CDN strategy is suitable for your business. Read this [section](https://docs.aws.amazon.com/whitepapers/latest/amazon-cloudfront-media/multi-cdn-considerations.html) of the [CloudFront For media](https://docs.aws.amazon.com/whitepapers/latest/amazon-cloudfront-media/amazon-cloudfront-media.html) whitepaper to learn more about the pros and cons of a multi-CDN strategy. When you adopt this strategy, you need to implement three major components:
* Benchmarking tooling to compare the performance of CDNs in a specific region, network or device type. It's recommended to use your client-side video QoE metrics such as playback errors and buffering ratio for this purpose. 
* Switching mechanism: is it based on DNS? HTTP? Midstream switching? etc..
* Switching logic to shift traffic from a CDN to another: What dimensions it includes (e.g. cost of delivery?)? what dimensions it prioritizes?

For in depth guidance about this subject, read the following two blog series ([1](https://aws.amazon.com/blogs/networking-and-content-delivery/using-multiple-content-delivery-networks-for-video-streaming-part-1/) & [2](https://aws.amazon.com/blogs/networking-and-content-delivery/using-multiple-content-delivery-networks-for-video-streaming-part-2/))

## CDN Stacking
A common multi-CDN architecture consists in completely isolating CDNs by having each CDN fill content from the origin independently. However, with this approach your origin costs will be multiplied by the number of CDNs, and if you have origin facing custom-logic, such as access control or failover, you need to implement them independently in each CDN.

![](/static-assets/multi-cdn-considerations-os.png)

Another approach to address the aforementioned challenges could be using CloudFront as origin to your other CDNs, as described in this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/using-cloudfront-origin-shield-to-protect-your-origin-in-a-multi-cdn-deployment/). Typically, you'd enable Origin Shield on your CloudFront distribution. However, this approach requires additional scrutiny over the redundancy of the setup. with this approach it's recommended to disable third-party CDN’s origin shield or centralized dedicated cache when using CloudFront as their origin, to reduce the blast radius of localized single PoP event.

## Additional resources
* TODO https://ns1.com/writable/resources/ns1-ds-mux-integration.pdf
* TODO talk about risk of cache miss configuration issues on a CDN
