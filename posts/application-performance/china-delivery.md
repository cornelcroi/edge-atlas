---
title: 'Content delivery in China'
metaDesc: 'Companies who operate business in China, consider deploying local infrastructure to overcome the performance and availability challenges of traversing the Great Firewall of China.'
socialImage: static-assets/china-delivery-global-origin.png
---
## Overview
Companies who operate business in China, consider deploying local infrastructure to overcome the performance and availability challenges of traversing the Great Firewall of China (GFW). AWS offers the possibility to deploy web applications using a local origin infrastructure and a local partition of CloudFront called CloudFront China (in comparison with CloudFront Global). To use local AWS infrastructure in China, companies need to acquire an [ICP license](https://www.amazonaws.cn/en/about-aws/china/faqs/?nc1=h_ls#new%20step).

# CloudFront China
CloudFront China is operated in China by a local partner for compliance, and it's built on an isolated infrastructure from CloudFront Global. While CloudFront global can deliver traffic to China from nearby PoPs, however, the traffic can be impacted by the challenges of performance and availability. CloudFront China help companies overcome these challenges. Note that while CloudFront China using a similar technology stack to CloudFront Global, it does'nt have a feature parity. Consider [the differences](https://docs.amazonaws.cn/en_us/aws/latest/userguide/cloudfront.html#feature-diff) between both CloudFront partitions when designing your application using CloudFront China.

# Common use cases

## Global origin
Companies typically have an origin deployed in one of AWS Global Regions (outside of China), and use a CloudFront Global distribution to deliver traffic globally. When their business grow in China to a certain level, they deploy a CloudFront China distribution to deliver traffic locally in China using the same global domain name while fetching the content from their Global Origin. Route 53 Global is used to route traffic to the most appropriate CloudFront partition based on the user location. To do that:
1. Create a distribution in CloudFront Global (e.g. `xyz.cloudfront.net`), then configure the alternate Domain Name/CNAME to `www.example.com`.
2. Create a distribution in CloudFront China (e.g. `abc.cloudfront.cn`), then configured the alternate Domain Name/CNAME to `www.example.com`.
3. Create a public Hosted Zone for “example.com” in Route 53 Global, then create two CNAME records using “Geolocation routing” policy for the record “www.example.com”. The location “Default” should point to `xyz.cloudfront.net`, and the second record configured with the location “China” should point to `abc.cloudfront.cn`. 

![](/static-assets/china-delivery-global-origin.png)

However, cache misses that needs to go back to the global origin from CloudFront PoPs still have to traverse the GWF with consequences on performance and availability. One way of improving this setup is to host your origin on EC2 in some AWS Global regions (such as regions in North America, Frankfurt, Tokyo, Singapore) which have enhanced network connectivity to CloudFront China. When you do that, it's recommended to enable BBR for TCP congestion on the origin servers. For more in depth guidance on this subject, contact AWS experts. 

![](/static-assets/china-delivery-global-origin-proxy.png)

## Local origin in China
For the best performance and availability; it's recommended to fully deploy the application locally using a dedicated domain name. The application would benefit from an origin in one of AWS China Regions, local delivery with CloudFront China and [Route 53 China](https://aws.amazon.com/about-aws/whats-new/2020/05/amazon-route-53-is-now-available-in-AWS-china-region/). To route traffic in an optimal way across both global and China deployments of your application, check the reference architecture described in this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/optimizing-performance-for-users-in-china-with-amazon-route-53-and-amazon-cloudfront/).

![](/static-assets/china-delivery-local.png)


## Additional resources
* TODO