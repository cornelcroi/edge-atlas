---
title: 'Redirection Management'
metaDesc: 'Redirections is a common functionality on websites, that could be used to localize content based on country, redirecting past campaign URLs to a landing page, etc...'
socialImage: static-assets/redirections-lambdaedge.png
---
## Overview
Redirections is a common functionality on websites, that could be used to localize content based on country, redirecting past campaign URLs to a landing page, etc... Executing redirections at the edge, i.e. on CloudFront level, has the benefit of reducing load on the origin, and making redirections faster. Developers can use CloudFront's Edge computing (CloudFront Functions and Lambda@Edge) to implement redirections in different ways optimized to their use case.

## Architectural decisions
To select the best architecture for your redirections, you need to answer the following questions:
* How frequently do you update your redirection logic?
* How many redirections rules do you have in your logic?
* What does redirections rule depend on? Request URL, headers such as accept, accept-language, etc.., , user country, etc..
* Do you need to rewrite the URL to the origin or send a 3xx redirection?

This [workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/814dcdac-c2ad-4386-98d5-27d37bb77766/en-US/getting-started) allows you to understand the different capabilities of [CloudFront Functions and Lambda@Edge to implement redirections at CloudFront](https://www.youtube.com/watch?v=EOdfku3BPFM) level.

## Common use cases

### Simple requirements for redirections
When your redirections have a simple logic, with few redirection rules that does not change frequently, then a solution based CloudFront Function configured on viewer request event is good starting point for you. The following [CloudFront Function code](https://github.com/aws-samples/amazon-cloudfront-functions/blob/main/redirect-based-on-country/index.js) sends a 3xx redirection to users to localized content based on their country.

```javascript
function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var host = request.headers.host.value;
    var country = 'DE' // Choose a country code
    var newurl = `https://${host}/de/index.html` // Change the redirect URL to your choice 
  
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

### Advanced requirements for redirections
When you have more sophisticated logic for redirections, for example when have marketing teams constantly updating thousands of campaign redirections, then a Lambda@Edge based solution is more suitable. In this case, you configure the Lambda@Edge function on origin request event, to be executed on every cache miss, then based on the request attributes, check with an external rule storage such as S3 or DynamoDB, what redirection rule to apply. Rules are managed in the selected storage, with a possibility to build a simple UI on top of it to facilitate management. The below architecture is an [example implementation](https://www.youtube.com/watch?v=F4KDOGNpSoI) using DynamoDB by Pernod Ricard to build their URL shortner service.

![](/static-assets/redirections-lambdaedge.png)

In [this blog](https://aws.amazon.com/blogs/networking-and-content-delivery/handling-redirectsedge-part2/) you can learn how to implement this using an S3 based storage for storing redirections rules, with a simple UI for authenticated administrators to manage them.


