---
title: 'Addressing OWASP Top 10 risks'
metaDesc: 'The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications. AWS provides companies with tools and guidance to build applications that address OWASP Top 10 risks.'
socialImage: static-assets/thumbnail-edge.png
---
## Overview
The [OWASP Top 10](https://owasp.org/www-project-top-ten/) is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications. AWS provides companies with tools and guidance to build applications that address OWASP Top 10 risks. For example, the [security pillar](https://wa.aws.amazon.com/wellarchitected/2020-07-02T19-33-23/wat.pillar.security.en.html) of the Well Architected Framework help companies build [Secure Designs](https://owasp.org/Top10/A04_2021-Insecure_Design/). Another example is AWS WAF which can be used as a first layer of defense against some of the risks highlighted in OWASP Top 10.

## Amazon Managed Rules 
The [Amazon Managed Rules](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html) AMR is a set of rules inspired by OWASP top 10 and maintained by the the AWS Threat Research Team (TRT). It's designed to to protect applications from the most common and high-severity threats threats while keeping a very low false positive rate across all customers. The AWS Threat Research Team (TRT) conducts routine testing of AMR rules to ensure that they are effective and kept up to date, and works with customers directly to iterate on these rules. You can use AWS Managed Rules for AWS WAF as part of a defense-in-depth strategy to protect your application against external threats. When you need more coverage for specific types of threats, consider adding custom rules in AWS WAF to address such threats.

Many [AWS partners](https://partners.amazonaws.com/search/partners?facets=Product%20%3A%20Security%20%3A%20AWS%20WAF) offer penetration testing services that can help you assess your application security and evaluate improvement opportunities. 

## Managed rules by security sellers
You can also consider Managed rules that are also inspired by OWASP Top 10 from the [AWS Marketplace](https://aws.amazon.com/marketplace/solutions/security/waf-managed-rules). It includes HighSecurity OWASP Set by CSC, Web exploits OWASP rules by F5 and Complete OWASP top 10 rulegroup by Fortinet.

## Additional resources
TODO Partner
TODO testing methodology
