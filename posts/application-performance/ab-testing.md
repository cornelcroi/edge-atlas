---
title: 'A/B Testing'
metaDesc: 'A/B testing or canary deployments technique allow developers to experiment with two or more variants of a web page. Variants are randomly shown to users, and then statistical analysis is used to determine which variant performs better for a given business goal.'
socialImage: static-assets/canary-deployments-cff.png
---
## Overview
A/B testing or canary deployments technique allow developers to experiment with two or more variants of a web page. Variants are randomly shown to users, and then statistical analysis is used to determine which variant performs better for a given business goal. A/B testing can be implemented in different ways according to requirements.

## Architectural decisions
First, you need to decide where to execute the variant selection logic: client side, edge side or origin server side.

**The first option** is to do A/B testing at client side. In this method, all variants are shipped to the user browser, then the application contacts an API to decide which version to display. [CloudWatch Evidently](https://aws.amazon.com/blogs/aws/cloudwatch-evidently/) is an AWS managed service that you can use to implement client-side A/B testing. To get started with this capability, go through this [workshop](https://catalog.workshops.aws/observability/en-US/evidently). However, client side approach has 2 drawbacks:
* The application needs to wait the A/B testing API response before rendering the page to users, which has impact on page performance
* Malicious users can learn about the different experiments going on by reverse engineering the client side application code. This is not always desirable.

**The second option** is to do A/B testing on the origin side. On a page load, the origin decides which version to send back to the customer. The main drawback of this approach is its incapacity to do A/B testing on cacheable content.

**The third option** is to do A/B testing at the edge side. Using CloudFront's edge computing capabilities (CloudFront Functions and Lambda@Edge), you can implement A/B testing in different ways as explained in [this workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/e507820e-bd46-421f-b417-107cd608a3b2/en-US). To choose the best implementation for your use case, you need to ask the following questions:
* Do you want to make sure users are always shown with the same variant? This stickiness ca be achieved using cookies. 
* How frequently do you make experiments?
* How many experiments are running in parallel?
* How fast do you want an experiment to be experienced by users?
* What dimensions are used to select a variant for a user? country, user-id, etc..
* How much you are willing to pay for this solution?

## Common use cases

### Occasional A/B testing for Single Page Applications
When you have a simple application, with occasional needs for A/B testing, consider a solution fully based on CloudFront Functions. The first function is configured on the viewer request event, associated to a Cache Behavior that catches HTML pages. When a request is received, the function will check the value of a cookie (e.g. experiment-id) and based on it rewrite the URL to the selected page version. If the cookie is not present, that select the version based on the desired logic, such as 60% for Version A versus 40% for version B in a specific country. Then the function associated with the same cache behaviour but on viewer response event, would set the cookie value to the selected version. If the logic changes, for instance to adjust the percentage of traffic, then the first function needs to be updated. Generally, changes take seconds to complete.

![](/static-assets/canary-deployments-cff.png)

### Continuous A/B testing on sophisticated web applications
With a more sophisticated webpage, such as e-commerce, with many teams executing many experiments in different parts of the website on a daily basis, the selection logic is too complex to be stored in a CloudFront Function. As a solution, the logic can be managed in DynamoDB global table, then a Lambda@Edge on viewer request event would query the dynamo table for each incoming request to decide which version to serve. The logic would be more complex, based on each user and web page for example. Another Lambda@Edge on viewer response event would set a unique cookie for each user to ensure stickiness. Usually developers use Feature Management tools like LaunchDarkly to provide an UI interface for managing experiments, then update the routing logic accordingly in DynamoDB. TrueCar and RyanAir are two AWS customers adopting this approach using CloudFront.

![](/static-assets/canary-deployments-dynamo.png)

## Additional resources
TODO



