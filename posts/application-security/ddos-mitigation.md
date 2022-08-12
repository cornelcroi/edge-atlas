---
title: 'DDoS Mitigation'
metaDesc: 'Applications built on AWS benefit from native protections against DDoS attacks, and can be designed to be highly resilient against such attack using AWS services and offered security controls.'
socialImage: static-assets/ddos-mitigation-bp.png
---
## Overview
Distributed Denial of Service (DDoS) attacks, if not mitigated, can impair the availability or degrade the response times of an application. If the application scales to absorb the attack, it could incur undesired scaling costs. Applications built on AWS benefit from native protections against DDoS attacks, and can be designed to be highly resilient against such attack using AWS services and offered security controls.

## AWS's DDoS mitigation
**Security is a shared responsibility between AWS and the customer**. AWS is responsible for protecting the infrastructure that runs all of the services offered in the AWS Cloud. AWS protects its infrastructure natively against infrastructure DDoS attacks (i.e. at layer 3 and 4) thanks to Shield Standard. Shield Standard is based on:
* Monitoring systems that are responsible for analyzing different sources such as networking devices and services logs to detect DDoS attacks.
* Scrubbing systems that are responsible for cleaning traffic from DDoS attacks thanks to Deep Packet Inspection for packet validation, firewalling and shaping. With CloudFront and Route 53, these systems are deployed in PoPs constantly inline of traffic, which results in sub-second detection and mitigation. In contrast, for regional services such as ALB or EC2, these systems clean traffic only when an attack is detected, usually within minutes.
* Shield Response Team, who are responsible for driving rapid resolution of DDoS attacks when they are not automatically detected and mitigated by the previously mentioned systems. 

In the shared responsibility model, your responsibility will be determined by the AWS Cloud services that you select. This determines the amount of configuration work you must perform as part of your security responsibilities. This is why you should carefully consider the services you choose as your responsibilities vary depending on the services used. For example, if you expose your files in S3 instead of exposing them from an EC2 instance, you push the frontiers of this responsibility towards AWS. AWS provides you with security controls to mitigate DDoS attacks (e.g. WAF to block HTTP foods) within your part of the shared responsibility model. AWS also provides you with tooling and services to monitor DDoS attack and enhance your incident response.

## DDoS resilient architectures
You are responsible for designing resilient architecture using AWS services. Read this [white-paper](https://d1.awsstatic.com/whitepapers/Security/DDoS_White_Paper.pdf) for in-depth guidance on how to do so, and go through [this lab](https://catalog.us-east-1.prod.workshops.aws/workshops/4d0b27bc-9f48-4356-8242-d13ca057fff2/en-US) for hands on experience. Some of the best practices include:
* Benefit from the best protection against infrastructure DDoS attacks by using CloudFront for web applications, and Global Accelerator for other use cases. In fact, CloudFront provides the highest protection against all known Layer 3 and 4 DDoS attacks and gives access to Tbps of mitigation capacity thanks to the distributed nature of AWS Edge network. With sub-second latency, mitigation on CloudFront is the fastest. In addition, scrubbing systems used with CloudFront offer more advanced mitigation capabilities such as suspicion based traffic shaping or SYN cookies. Finally, CloudFront natively protects against DDoS attacks with malformed HTTP requests, or slowloris kind of attacks. 
* Reduce the attack surface of your origins using Origin Cloaking techniques.
* Prepare your application to scale, for example using autoscaling with EC2 based origins.
* Filter HTTP traffic using AWS WAF

![](/static-assets/ddos-mitigation-bp.png)

## Block HTTP floods with AWS WAF
HTTP floods can be blocked in AWS WAF using different techniques:
* Based on IP reputation using [Managed IP Reputation rule groups](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html) (Amazon IP reputation list, Anonymous IP list, etc..)
* Based on rate limiting. Read [this blog](https://aws.amazon.com/blogs/security/three-most-important-aws-waf-rate-based-rules/) to learn about advanced ways to implement rate limiting using AWS WAF.
* Based on rules automatically created by Shield Advanced's [automatic application layer DDos mitigation](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-automatic-app-layer-response.html).
* Based on bot control capabilities. TODO link to other page

## Enhance resiliency with Shield Advanced
Shield Advanced is an additional AWS service you can subscribe to to enhance your security posture against DDoS attacks. Notably, Shield Advanced provides the following benefits:
* Automatic mitigation at layer 7 using WAF for web applications. Non web applications can also benefit from better protections such as enforcing NACL rules for VPC based applications in the scrubbing systems instead of at the resource level.
* Visibility on DDoS events using CloudWatch metrics.
* Financial protection against DDoS attacks that scale your infrastructure and incurs unexpected costs.
* The possibility to be supported by the Shield Response Team during an incident response cause by a DDoS attacks. For example, they can help crafting WAF rules to block the attack.

## Additional resources
* TODO
