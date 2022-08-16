---
title: 'Host a statically generated site (SSG)'
metaDesc: 'In this tutorial, you will learn how to deploy a statically generated website using S3 and CloudFront'
socialImage: static-assets/host-ssg-website.png
---
## Overview
In this tutorial, you will learn how to deploy a statically generated website using S3 and CloudFront. You will also learn how to secure your website using WAF, and implement common functionalities like image optimization and A/B testing using CloudFront Functions. To get started, navigate to the [tutorial](https://catalog.us-east-1.prod.workshops.aws/workshops/6a4eef62-610e-4446-9131-ad28e19b8709/en-US/) page.

![](/static-assets/host-ssg-website.png)

The tutorial consists of 5 labs:
* Static website deployment into Amazon S3 and testing the content acceleration by accessing it through the CloudFront distribution and directly from S3.
* Dynamic website performance testing via comparing a dynamic website behind API Gateway vs. behind CloudFront.
* Making the website compatible with mobile devices by implementing image optimizations with Lambda@Edge and CloudFront Functions.
* Protecting CloudFront distribution by AWS Bot Control to block malicious requests coming from bad bots pretending to be Search Engines or Social Media crawlers. Next, we will learn how to use CloudFront response headers policies to implement web security best practices such as Content Security Policy (CSP).
* Implementing A/B testing of the changes done to the website with CloudFront Functions.







