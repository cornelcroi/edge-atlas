---
title: 'Troubleshooting'
metaDesc: "When the application has multiple components, such as an ALB based origin, and CloudFront configured with Lambda@Edge, errors can happen at multiple level."
socialImage: static-assets/thumbnail-edge.png
---
## Overview
When the application has multiple components, such as an ALB based origin, and CloudFront configured with Lambda@Edge, errors can happen at multiple level. For example, the origin is temporary overloaded and it returns 5xx errors, CloudFront can't connect to the origin or Lambda@Edge execution failed because of unhandled exception in the function code. Operators or SREs need to troubleshoot such as errors, to understand their origin and employ corrective measures.

## Tracing requests from users to the origin
For each request processed by CloudFront, CloudFront generates a unique request-id that can be used to trace the request across the application stack. This request-id is visible in multiple places:
* On the user side, when CloudFront returns the response, it adds the `x-amz-cf-id` header that contains the request-id.
* In [CloudFront logs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/logging.html), every request generates a log record that contains the request-id in the `x-edge-request-id` field.
* If WAF is associated with a CloudFront distribution, and [WAF logging](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html) is enabled, each request generates a log record that contains the request-id in the `requestId` field.
* If CloudFront's Edge computing capabilities are used on the viewer events, the request-id is available to the function in the `requestId` field of the event object ([CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html), and [Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-viewer-request)).
* Finally, if it's a cache miss, the request is sent back to the origin with the request-id in the `x-amz-cf-id`. Make sure you log it on your origin servers.

## Troubleshooting errors
When your monitoring systems, such as when using CloudWatch metrics and alarming, detect a rise in delivered [4xx or 5xx errors](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional:~:text=Error%20rate%20by%20status%20code), you need to understand the error: On what layer it's occurring, and what is the error type? To do that, you need to analyze the CloudFront logs to filter requests having the error code, then check the following fields `x-edge-result-type`, `x-edge-response-result-type`, and `x-edge-detailed-result-type` to understand the issue. In the [CloudFront documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/troubleshooting-response-errors.html) you can find description of common errors. If the error is coming of the origin, then check the logs of the origin while tracing the error request using its request-id.

Analyzing CloudFront logs depends on where do you store your logs. A very simple approach is to query the CloudFront logs stored in S3 using [Athena](https://docs.aws.amazon.com/athena/latest/ug/cloudfront-logs.html). After you set up Athena for your CloudFront logs, you can analyze the logs using standard SQL queries. The following example filters the logs for 5xx errors in a specific date range, limited to the first 100 records.

``` sql
SELECT * AS count FROM cloudfront_logs
WHERE status >= 500 AND "date" BETWEEN DATE '2022-06-09' AND DATE '2022-06-10'
LIMIT 100;
```
+ we got all li
Sometimes, you need to check the logs of other services to understand what happened. For example:
* Check the logs of WAS WAF, to understand if a specific request was blocked, and for which reason.
* If the error is caused by an execution error in the edge computing functions, then check their logs to understand the origin of the error.

Read this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/four-steps-for-debugging-your-content-delivery-on-aws/) for more details about this topic.


## Troubleshooting performance
In some cases, you are experience subpar performance, that is not causing HTTP errors, but is impacting the experience of your users. You can troubleshoot performance using the combination of multiple techniques:
* In addition to the default CloudWatch metrics, you can enable [additional metrics](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html#monitoring-console.distributions-additional) for CloudFront such as `Origin latency` (first byte latency on cache misses) and `Cache hit rate` (ratio of cache hits), that can give you an indication of the application performance. 
* Analyze the CloudFront logs based on the first byte latency field `time-to-first-byte` and the last byte latency field `time-taken`. You can group logs by different dimensions such as URL, country or pop to isolate the performance issue to a single dimension.
* Configure CloudFront's [server timing headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/understanding-response-headers-policies.html#server-timing-header) in the response header policy to better understand for a specific request where most of the latency was spent. For example, was is spent on CloudFront side, or on origin side?

It's recommended to deploy monitoring on the client side using tools such as [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) to get a full picture on performance both on client and server side.

## Asking help from AWS Support
In scenarios where you need the help of AWS support to troubleshoot errors or performance issues, it's recommended to include in your ticket to support, a list of request-ids that represent such requests. With these request-ids, the support are able to troubleshoot more in depth the behavior of the the requests on CloudFront.

## Additional resources
* TODO error caching
* TODO pragma requests
* TODO other headers like age, pop
* TODO error coming from CloudFront or the origin?
* TODO OLX https://aws.amazon.com/blogs/architecture/field-notes-how-olx-europe-fights-millions-of-bots-with-aws/
* TODO other info for support
* TODO NEL