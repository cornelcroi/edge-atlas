---
title: 'Change Management'
metaDesc: "Developers can safely introduce changes to their content delivery solutions, such as updating CloudFront Function code, or adding new routes in CloudFront's cache behaviors, or updating WAF rules or invalidating files in CloudFront."
socialImage: static-assets/thumbnail-edge.png
---
## Overview
Developers can introduce changes to their content delivery solutions, such as updating CloudFront Function code, moving Lambda@Edge to new version of Nodejs, adding new routes in CloudFront's cache behaviors, enabling a new available feature in CloudFront such as HTTP/3 over QUIC, updating WAF rules or invalidating files in CloudFront. There are multiple ways of introducing such changes.

## AWS Console
If you do not want to invent in a CI/CD pipeline, and have a relatively low requirements in making changes to their content delivery solution, then you can rely on the AWS Console to make such changes manually.

## CI/CD pipeline
If you prioritize deploying changes in a controlled way, with minimal manual steps, then automate the process using CI/CD tooling. AWS edge services can be deployed using Infrastructure as Code tooling such as [CloudFormation](https://docs.aws.amazon.com/fr_fr/AWSCloudFormation/latest/UserGuide/aws-resource-cloudfront-distribution.html) and [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudfront_distribution). The following [blog](https://aws.amazon.com/blogs/networking-and-content-delivery/managing-lambdaedge-and-cloudfront-deployments-by-using-a-ci-cd-pipeline/) gives an example of how to deploy a CloudFront distribution with a Lambda@Edge function, using a CI/CD pipeline based on AWS tooling (i.e. CodePipeline and CodeDeploy) with a staging step, and testing step before deploying to production. It's important to note the following considerations:
* While CloudFront, and CloudFront Functions can be deployed from any AWS region, WAF for CloudFront and Lambda@Edge must be deployed from us-east-1
* You can't use two Cloudfront distributions with the same CNAME.
* When each team is deploying their own application using their own CI/CD pipeline, the set up is straightforward. However, when you have a single team managing the CI/CD pipeline, and multiple teams introducing changes to the content delivery solution, then you need an extra step in the CI/CD pipeline. For example, you might have a single CloudFront distribution to deliver your different APIs from the same domain name, however each API is managed by a different team, and have different requirements in terms of defining the cache key, and the origin. In this scenario, you need to define a template for a CloudFront route configuration (.i.cache behavior), and each application team manages their own route configuration (e.g. in a text file store in S3), then your CI/CD pipeline will merge these routes into a single CloudFront CloudFormation template before deployment.

## Firewall manager for large scale WAF deployments
You can deploy [WAF changes](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-wafv2-webacl.html) to content delivery solution using the same CI/CD pipeline described above. However, when you have a large organization like [OLX](https://aws.amazon.com/blogs/architecture/field-notes-how-olx-europe-fights-millions-of-bots-with-aws/) with different application teams then consider using Firewall Manager for such scenarios. Note that you can sill use a CI/CD pipeline to deploy WAF rules into your Firewall Manager WAF policy, that in its turn will deploy WAF WebACLs to resources across your organization. This approach has the following benefits:
* It facilitates the deployment of central rules in combination of rules managed by application teams
* Most likely faster to deploy, which can be critical for certain WAF operations such as virtual patching.
* Easy solution to deploy, especially when the organization doesn't have a single CI/CD pipeline (e.g. has heterogeneous AWS accounts from acquisitions)

However, if you go into this direction, you need to manage drift if you are using a CI/CD pipeline with drift detection.

## Invalidations
CloudFront allows you to invalidate content from it's cache, to force CloudFront servers to fetch the content again from the origin. CloudFront reports an invalidation as complete when all edge locations has acknowledged the invalidation of the content to the control plane. Completion time might take minutes, but in reality 90%+ of CloudFront servers would have already invalidated the content within seconds.

It's recommended to consider invalidations as a last resort option rather than part of the normal operations. In fact, invalidations have cost, they do not affect cached content on browsers, and they do not benefit from the same availability of data plane operations (e.g. relying on Cache Control header) because invalidations are control plane operations. Cache-Control standard provides you with multiple directives to control the freshness of cache in CloudFront and in browsers: max-age, s-max-age, no-cache, private, etc..

## Additional resources
* TODO Blue/Green deployment
* TODO best practices: count mode, etc..





