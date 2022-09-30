---
title: 'Edge Functions'
metaDesc: 'Edge functions are powerful tools in the hands of developers to add custom logic at the edge, on CloudFront level.'
socialImage: static-assets/edge-computing-events.png
---
## Overview
Edge functions are powerful tools in the hands of developers to add custom logic at the edge, on CloudFront level. With this option, developers have a choice of execution locations (origin side, ege side & client side) that they can mix and match to build modern and performant web applications. 

## Use cases 
Edge functions can be used for:
* **Implementing sophisticated caching rules**. CloudFront provides you with native rules such as redirection from HTTP to HTTPs, routing to different origins based the request path, etc... When you want to implement rules that are not available natively in CloudFront, such as normalizing cache keys, or rewriting URLS, then you can use CloudFront's edge computing capabilities.
* **Reducing application latency**. Some application logic can be offloaded from the origin to the edge to benefit from caching (e.g. A/B testing) or to execute closer to users (e.g. HTTP redirections, URL shortening, HTML rendering).
* **Enforcing Security at the perimeter**. Applying security logic, such as authorization or sophisticated geo-blocking logic, as the edge reduces the attack surface of your origin, and decreases its scaling costs.
* **Application level load balancing**. You can use CloudFront's Edge functions to route each request differently based on application logic. This can be useful for scenarios such as failover, load balancing, multi-region setups, migrations, application routing, etc...

Edge functions can be either used to manipulate the HTTP request and response while it's flowing across CloudFront layers, or simply to terminate the request and generate a response instead of continuing it's normal flow in CloudFront. Edge functions can be configured to be executed at different events during the lifecycle of a request on CloudFront:
* Viewer events: Executed for every request, before checking CloudFront cache. It's an ideal place for cache normalization, authorization or placing unique cookies. 
* Origin events: Executed on cache misses, before going back to the origin to fetch the content. It's an ideal place to generate content or manipulate it before caching it, and to route requests dynamically to different origins.


## Edge functions with CloudFront
CloudFront provides you with two flavors of edge functions: CloudFront Functions or Lambda@Edge. CloudFront Functions offer sub-millisecond startup times and scales immediately to handle millions of requests per second, which makes it ideal for lightweight logic (cache normalization, url rewrite, request manipulation, authorization, etc...) that usually is configured on viewer events. Lambda@Edge is an extension of AWS Lambda, where CloudFront executes AWS Lambda in a distributed way across its Regional Edge Locations. Lambda@Edge offers more computing power, and advanced functionalities such as making external network calls, but with higher cost and latency overhead. For more in depth detail about the differences between both runtimes, read this [documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html)

As a general guidance, first consider CloudFront Functions for use cases that are executed at viewer events, and Lambda@Edge for use cases that are executed at origin events. Only consider Lambda@Edge for viewer event if CloudFront Functions' capabilities can't meet the requirement of your logic. If you do this, note that you either use Lambda@Edge or CloudFront Functions for viewer events, you can't mix both (e.g. Lambda@Edge on viewer request event and CloudFront Functions on viewer response event). Finally, consider the [restrictions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html) on edge functions when you design your use case.

![](/static-assets/edge-computing-events.png)

In both cases, consider associating an Edge function to the most specific cache behavior, to avoid unnecessary functions execution cost.

### CloudFront Functions
CloudFront functions are written in JavaScript, can be built and tested entirely within CloudFront Console and APIs, and can log to CloudWatch logs in us-east-1 region. As a developer, you need to write functions with [compute utilization less than 100](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/test-function.html) (80 to be on the safe side). Executions that exceed compute utilization quotas will be throttled. You can monitor such events using [CloudWatch metrics](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/monitoring-functions.html). 

To write CloudFront functions, read about their [programming model](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html). Below is an example function to redirect users coming from Germany to localized content in German:

```javascript
function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var host = request.headers.host.value;
    var country = 'DE' 
    var newurl = `https://${host}/de/index.html` 

    if (headers['cloudfront-viewer-country']) {
        var countryCode = headers['cloudfront-viewer-country'].value;
        if (countryCode === country) {
            var response = {
                statusCode: 302,
                statusDescription: 'Found',
                headers:
                    { "location": { "value": newurl } }
                }

            return response;
        }
    }
    return request;
}
```

### Lambda@Edge

Lambda@Edge functions can be written in NodeJs or Python. They allow developer to benefit of the power of a Lambda container, with configurable memory (up to 10GB). Since it's based on Lambda, functions are developed in the Lambda console (exclusively in us-east-1), then replicated by CloudFront to its global Regional Edge Locations. To associate a Lambda@Edge function with CloudFront Function, you need to publish a new version of it, then deploy it to CloudFront. Every change, will trigger a new CloudFront deployment (in contrast to CloudFront Functions, where only the initial association will trigger a CloudFront deployment). Consider the following when developing Lambda@Edge functions:
* Read about [best practices](https://aws.amazon.com/blogs/networking-and-content-delivery/lambdaedge-design-best-practices/) for designing designing functions, notably around managing concurrency. Concurrency measures the number of Lambda containers spin up simultaneously per Regional Edge Cache region. In each region, concurrency has quotas in terms of bursting speed and absolute limit. 
* When you need external data in your Lambda@Edge logic, read about [best practices](https://aws.amazon.com/blogs/networking-and-content-delivery/leveraging-external-data-in-lambdaedge/) for fetching data from external sources such as DynamoDB or S3.
* Lambda@Edge logs are shipped to CloudWatch logs in the region where they were executed with a log group name prefixed by `us-east-1`. If you need to centralize Lambda@Edge logs in a single region, follow the guidance in this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/aggregating-lambdaedge-logs/). Note that every execution generates logs to CloudWatch (in contrast to CloudFront Functions, logs are generated only when emitted in the function code). You can disable Lambda@Edge logs by removing from its associate role, permissions to send logs to CloudWatch. 

To write Lambda@Edge functions, read about their [programming model](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html). Below is an example function that routes requests coming from german users to an server based in Germany for regulatory purposes :

``` javascript
'use strict';

exports.handler = (event, context, callback) => {
     const request = event.Records[0].cf.request;
     
  if (request.headers['cloudfront-viewer-country']) {
         const countryCode = request.headers['cloudfront-viewer-country'][0].value;
         if (countryCode === 'DE') {
             const domainName = 'origin.example.de';
             request.origin.custom.domainName = domainName;
             request.headers['host'] = [{key: 'host', value: domainName}];
         } 
     }
     
    return request;
};
````