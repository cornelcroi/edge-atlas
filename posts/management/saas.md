---
title: 'Multi-tenant SaaS deployments'
metaDesc: 'SaaS providers operate multi-tenant solutions that require specific design considerations when building them using AWS edge services such as CloudFront and WAF.'
socialImage: static-assets/aas-s3.png
---
## Overview
SaaS providers operate multi-tenant solutions that require specific design considerations when building them using AWS edge services such as CloudFront and WAF. The architecture is designed to meet the target tradeoff between flexibility, cost, scalability and operational overhead.

## Architectural decisions
There are multiple architectural decisions to be made when designing a multi-tenant solution using CloudFront:
* Do you use the host name for all tenants or do you use separate host names? If you are using the same host name, you can only deploy using a single CloudFront distribution.
* If you are using separate domain names, are they domain names controlled by the your tenants (e.g. tenant1.com, tenant2.com) or controlled by you (e.g. tenant1.saas.com, tenant2.saas.com). A CloudFront distribution can be associated with a single TLS certificate, which can host multiple host names (SAN certificates). When you control the domain name, you have the choice of creating a distribution by tenant, or use a single distribution with wildcard CNAME and TLS certificate (*.saas.com) for all tenants. If the tenants control the domain name, you can use a CloudFront distribution with SAN certificate that can host up to 100 different domains. However, the more domains you attach to the same TLS certificate, the more friction is added to the Certificate issuance process.
* Do tenants share the same content or different content? If they share common content, consider hosting this shared content on a single domain that can be shared by different tenants. This will result in better cache hit ratio for shared content.
* Are tenants hosted on the same origin (from CloudFront perspective) or different origins? 
    * If you are using the same origin, you can differentiate tenants by URL path (such as with an S3 origin) natively or by host header (such as with an ALB based origin) by adding the host header to the cache key.
    * If you are using different origins, you can differentiate by path natively in CloudFront with cache behaviors but with limits to the number of cache behaviors per distribution. You can also differentiate using other parameters such as Host or combination of host and URL, and use Lambda@Edge on origin request event to route traffic to the right origin. In this case, you need to add those differentiating parameters to the cache key.

Consider the following trade-offs in your design:
||Each tenant is hosted on a dedicated CloudFront distribution |Multiple tenants hosted on the same CloudFront distribution |
|----|----|----|
|**Observability**| Available natively per tenant | Available at the distribution level, extra effort is needed to extract metrics per tenant using logs |
|**Blast Radius**| A change impacts only one tenant | A single change impacts all tenants |
|**Operational Overhead**| Requires automation at scale, with batched roll outs to avoid throttling at CloudFront API level| Very low | 
|**Customization**| Each tenant can have it's own different configuration| Same config to all tenants. When you enable WAF, it's charged for all requests | 
|**Performance**| Each distribution needs to be warmed separately (e.g. connections to origin) | All tenants benefit from the warmed distribution | 

Note that you can mix and match. You can have multiple tiers of services:
* Basic tier, where all tenants share the same distribution and where you control the domain name
* Premium tier, where each tenant have a dedicated distribution with custom domain name and custom configuration (WAF).

Finally, you can have a single WAF WebACL for all tenants, or use multiple ones based on the same previous logic. 

## Common use cases

### Multi-tenant origin with controlled domain name per tenant
Every tenant has a subdomain that you control (tenant1.saas.com). Route 53 is configured with wildcard Alias record (*.saas.com) to a CloudFront distribution, also configured with wildcard CNAME, with Host header added to the cache key. There are multiple scenarios:
* **Single custom origin** (e.g. ALB/EC2): There is nothing more to configure.
* **Multiple custom origins**: You need a Lambda@Edge function on origin request event to route the request to the right origin. Read this [blog](https://aws.amazon.com/blogs/architecture/dynamic-request-routing-in-multi-tenant-systems-with-amazon-cloudfront/) to learn how OutSystems implemented this scenario.
* **Single S3 Bucket**: A CloudFront Function is configured on the viewer request event to read the host header, and rewrite it to the correspondent tenant key in the S3 bucket (tenant1.saas.com/index.html -> s3://bucket:arn/tenant1/index.html)

![](/static-assets/saas-s3.png)

### Tenant controlled domain names
Create a new CloudFront distribution for every new tenant. Automate the creation of the distribution, and the TLS certificate issuance using Amazon Certificate Manager. Make sure that you raise relevant limits (e.g. number of distributions per account, number of TLS certificates) before hand. In certain cases, you need to shard your distributions across multiple AWS accounts.

### Do it your own
If the scale of your requirements cannot be satisfied by CloudFront, then consider using a fleet of reverse proxy (NLB/EC2 based) to terminate TCP/TLS connections, fronted by Global Accelerator. Note that in this case, you can not benefit from caching functionality.

## Additional resources
TODO Saas factory https://aws.amazon.com/partners/programs/saas-factory/
TODO coming blog by Tzoori
TODO Automated TLS certificate creation and Free ACM
TODO CORS
TODO WAF explained more
TODO https://aws.amazon.com/blogs/infrastructure-and-automation/deploy-spa-with-personalized-subdomains-using-aws-cdk/
TODO CF distro is for free.


