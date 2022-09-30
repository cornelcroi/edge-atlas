---
title: 'Monitoring'
metaDesc: 'Companies monitor their content delivery solutions to detect any unusual events and quickly react to it.'
socialImage: static-assets/monitoring-cloudwatch.png
---

## Overview
Companies monitor their application deliver to detect any unusual events and quickly react to it. Examples of such events include an unexpected increase in traffic volumes, a significant drop in Cache hit ratio, an sharp rise in 5xx error rate, a DDoS attack or unusual number of blocked requests in WAF, or a slower page load times. Companies can monitor their application delivery on AWS using a combination of server-side and client-side options in CloudWatch.

## Server-side monitoring

### Metrics emitted by AWS Edge services
AWS Edge services emit near-real time metrics that can be monitored in CloudWatch. 
* **CloudFront** emits by default the following [metrics](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html): Requests, Bytes downloaded, Bytes uploaded, 4xx error rate, 5xx error rate and Total error rate. Note that these metrics are available in us-east-1 region. You can enable the following additional metrics, for an extra charge: Cache hit rate, Origin latency and Error rate by status code.
* **Edge Functions** emit the following metrics:
    * CloudFront Functions emits the following [metrics](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/monitoring-functions.html#monitoring-functions-metrics) in us-east-1 region: Invocations, Validation errors, Execution errors, Compute utilization and Throttles.
    * Lambda@Edge, is based on a subset of what [metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html) AWS Lambda emits in each region where it's executed by CloudFront. Metrics include: Invocations, Errors, Duration, Concurrent Executions and Throttles. The CloudFront console offers a consolidated view of these metrics across all regions.
* **WAF** can be configured to emit a [metric](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html) for each rule in the WebACL. Metrics include the number of Allowed requests, blocked requests, counted requests, and requests with Captcha configured. When used with CloudFront, these metrics are available in us-east-1 region.
* **Shield Advanced** emits [metrics](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html) about detected ongoing DDoS attacks, for example DDoS Detected, attack Bits per second, packets per second, and requests per second.

You can add key metrics to your existing application monitoring dashboard in CloudWatch, or [create a new dashboard](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create_dashboard.html) in CloudWatch. 

![](/static-assets/monitoring-cloudwatch.png)

### Custom metrics
You can create composite metrics in CloudWatch and display them in your monitoring dashboard. For example:
* Let's say you are interested to display the total requests per second delivered by you CloudFront distribution. You just need to divide the requests metric emitted by CloudFront by the period of measurement (`m1/PERIOD(m1)`).
* In Shield Advanced, you have the possibility to automatically escalate a availability impacting DDoS event to the AWS Shield Response Team for help. To do that, you need to configure the [Proactive Engagement](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-srt-proactive-engagement.html) feature of Shield Advanced with a metric that reflects when your application's availability is impaired. To avoid unnecessary escalations, a [composite metric](https://docs.aws.amazon.com/waf/latest/developerguide/health-checks-best-practices.html) would give you more confidence to initiate an escalation. The metric could be for example based on having simultaneously elevated 5xx error on CloudFront, increased number of CloudFront requests and elevated latency on the server side.

Another way of creating custom metric is based on configuring [metric filters](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CreateMetricFilterProcedure.html) on logs sent to CloudWatch by AWS edge services. For example, you can have your CloudFront function to log application level data (e.g. number of GET requests vs POST, number of requests coming from a embargoed countries, etc..)

### Alerting 
In addition to displaying metrics in your CloudWatch dashboards, you can [create alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) to get notified when these metrics indicate an undesirable ongoing event. You can follow this [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/four-steps-for-debugging-your-content-delivery-on-aws/) to set up an alarm based on static threshold for 5xx error rate. In addition to alarming when your metrics go beyond a static threshold, you can configured CloudWatch to alarm you when the metric evolve in an abnormal compared to its usual pattern, thanks to the [Anomaly detection](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html) capability in CloudWatch. You can configure CloudWatch to be notified in different ways, including by email and on [Slack](https://aws.amazon.com/blogs/aws/aws-chatbot-chatops-for-slack-and-chime/).

### Security findings in Security Hub
AWS Firewall Manager [creates findings](https://docs.aws.amazon.com/waf/latest/developerguide/fms-findings.html) for resources that are out of compliance and for attacks that it detects and sends them to AWS Security Hub. Some of the findings include:
* A resource is missing Firewall Manager managed web ACL
* Firewall Manager managed web ACL has misconfigured rule groups
* Resource lacks Shield Advanced protection
* Shield Advanced detected attack against monitored resource

## Client-side monitoring
Client-side monitoring completes the picture in terms of monitoring, by giving you metrics that reflect the user experience on your web application, which usually correlate strongly with your business KPIs.

### Real User Monitoring
It's recommended to set up Real User Monitoring to measure the quality of experience as perceived by your users. It allows you to detect events that are not visible on using server-side monitoring, such as the page load times. In addition to detecting undesirable events in your content delivery solution, it also allows you to detect regressions in the performance of your application code (e.g. a change in the HTML layout, increased page load times). You can implement real user monitoring using [CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html). First you need to add a javascript tag to your web application to let CloudWatch collect client-side metrics available in HTML APIs. Then, you will be able to monitoring the following in your application:
* The performance of your application: Network level metrics and application level metrics (e.g. Google Core Web Vitals)
* The user journey on your web application: How do users navigate and on your website and engage with your application?
* Errors logged at client side

### Synthetics monitoring
Synthetics is a complementary client-side technique to monitor your application, that works best during the development phase of your application. When you make changes to your application, it's recommended to add a testing step in your CI/CD pipeline to verify that there were no regression made to the application's performance, before deploying it in production. Consider using [CloudWatch Synthetics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html) for this purpose.
