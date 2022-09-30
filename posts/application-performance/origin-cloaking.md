---
title: 'Origin Cloaking'
metaDesc: 'Origin Cloaking stops malicious actors from by-passing CloudFront with its security controls to attack the origin directly.'
socialImage: static-assets/origin-cloaking-app-level-alb.png
---
## Overview
Origin Cloaking is a technique to reduce the attack surface of web applications. As a single a entry point to their application, developers use CloudFront, where they configure security controls such as protections against DDoS attacks and undesired bots. Origin cloaking stops malicious actors from by-passing CloudFront with its security controls to attack the origin directly. With Origin Cloaking, the origin is configured to accept traffic exclusively coming from CloudFront. This can be achieved at multiple levels of the network stack.

## Origin Cloaking on physical level
If your origin is on your premises (on-prem), you can ensure that traffic between your origin and CloudFront is kept on a privately managed network by setting up [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html) between your on-prem infrastructure and AWS using a public virtual interfaces on the Direct Connect connection.

## Origin Cloaking on network level
CloudFront publishes the IP addresses it uses to reach the origin in this [list](https://ip-ranges.amazonaws.com/ip-ranges.json), with the `CLOUDFRONT_ORIGIN_FACING` value of the `service` field. You can implement on your origin's firewall ACLs to block traffic not originating from CloudFront origin facing IPs.

If your origin is hosted in a VPC in AWS, this could be simply implemented by attaching Security Groups to your origins, that include the [AWS-managed prefix list for Amazon CloudFront](
https://aws.amazon.com/blogs/networking-and-content-delivery/limit-access-to-your-origins-using-the-aws-managed-prefix-list-for-amazon-cloudfront/)

Note that it's recommended to establish secure connections over TLS between [CloudFront and your origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-cloudfront-to-custom-origin.html).

## Origin Clocking on application level
With the network level protections, your application can still be prone to a malicious actor discovering your origin domain name and creating a CloudFront distribution they own to bypass the security controls of the CloudFront distribution protecting your origin. On top of obfuscating the selected domain name for your origin (e.g. avoid origin.example.com), you can add application level access controls to further reduce attack surface. This can be implemented in different ways according to the origin type:
* If you manage the http server at the origin, such as an NGINX server on prem or using EC2, then you can send a header with a secret from CloudFront, that is validated at your server before processing requests. This header can be sent using CloudFront's [Origin Customer Headers feature](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html).
* When the origin is based on ALB, the secret header can either be validated by a [rule on ALB](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html#restrict-alb-route-based-on-header) or by an AWS WAF [WebACL associated to the ALB](https://aws.amazon.com/blogs/security/how-to-enhance-amazon-cloudfront-origin-security-with-aws-waf-and-aws-secrets-manager/).
* When the origin is an API Gateway, the secret key can be validated using [API keys](https://aws.amazon.com/blogs/compute/protecting-your-api-using-amazon-api-gateway-and-aws-waf-part-2/).
* When the origin is an S3 bucket, CloudFront's [OAI](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) feature allows developer to keep the bucket private and only allowing access to CloudFront.

![](/static-assets/origin-cloaking-app-level-alb.png)

## Origin Cloaking with Global Accelerator
If the application is using Global Accelerator for its entry point, and the origin is ALB or EC2, then you can keep the origin resources in a private subnet. Global Accelerator doesn't require exposing your applications directly to the internet.