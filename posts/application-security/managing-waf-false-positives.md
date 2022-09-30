---
title: 'Managing false positives in AWS WAF'
metaDesc: "When security controls are added to an architecture, they can cause false positives, which represent legitimate user requests that were blocked. AWS WAF allows developers to reduce false positives."
socialImage: static-assets/thumbnail-edge.png
---
## Overview
When security controls are added to an architecture, they can cause false positives, which represent legitimate user requests that were blocked. It's not a desirable effect for developers, who try to reduce false positives frequency using different techniques. AWS WAF allows developers to tune their rules to reduce false positives, but in the same time false negatives (i.e. malicious requests that were not blocked). Check this [demo](https://www.youtube.com/watch?v=ckPzB5I0YJc) that shows AWS WAF capabilities in tuning false positives.

## Identifying false positives
To help identify false positives, consider the following:
* Set up alarming on selected WAF rules in [CloudWatch](https://docs.aws.amazon.com/waf/latest/developerguide/monitoring-cloudwatch.html) to be notified when a rule is triggered when predefined thresholds are exceeded.
* Enable [WAF logging](https://docs.aws.amazon.com/waf/latest/developerguide/logging.html). Have security and application teams review and baseline blocked traffic on a regular cadence to identify threat patterns and anomalies in blocked traffic. 
* Update your application experience to allow real users to report unexpected unauthorized access to your application. For example, when WAF is deployed with CloudFront, you can use custom error pages to catch 403 error codes and serve a friendly response. This page can prompt the user to provide information on the issue they’ve encountered.

## Configure WAF rules
In AWS WAF, you have the full control on which and how rules are added to your WebACL. For example, if you add a rate limit rule, you have full control on the thresholds of rate limiting. If a rate limit was cause false positives, you can increase the threshold to appropriate levels, as described in this [blog](https://aws.amazon.com/blogs/security/three-most-important-aws-waf-rate-based-rules/). Another example is when you use SQL injection (SQLi) rules, you have the possibility to choose the [detection sensitivity](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-sqli-match.html) of such rules.

[Amazon Managed Rules (AMR)](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html) are designed in a way that reduces possible false positives. However, if you add an AMR to your WebACL, you can control false positives by configuring your WebACL to use a [specific version](https://docs.aws.amazon.com/waf/latest/developerguide/waf-managed-rule-groups-versioning.html) of AMR instead of the latest version by default. This would give you time to do quality assurance tests before enabling the latest version.

## Limit the scope of rules
Once you define your rules, you can reduce false positives by limiting the scope of configured rules. 

For custom rules, you can define exceptions using AND/OR logic. For example, only apply SQLi rules for requests not coming from an allowed IP list, or for certain URLs.

For AMR rules, you can limit the scope of rules in different ways:
* Only enable the relevant sub-rules of your AMR. For example, in the [Core Rule Set AMR](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs), you can disable rules that benefit an origin based on EC2 instances, such as EC2MetaDataSSRF rules.
* Scope down the rules to be applied only to a specific set of requests, for example only apply Bot Control managed rule to HTML files.

Note also that rules on AWS WAF are executed in order, and the execution stops at the first matching rule (except for Count rules). If you have traffic coming from trusted sources, you can consider allowing their IP before other blocking rules to reduce further false positives.

## Respond with a nuanced rule action
When a rule matches a request, you can configure it to block it. However, you can adopt a more nuanced strategy to respond to such requests to minimize false positives. You can use the following techniques for a nuanced rule action:
* Responding with a Captcha challenge
* Allowing the request, but sent a signal to the application upstream in a header. For example, you can use detections by Account Takeover Prevention to trigger a Multi-Factor Authentication in your application for suspicious login attempts.
* AMRs emit labels when they are evaluated. You can set their action to Count, and then use the emitted label in combination with other rules to block users on a higher confidence level. For example, you can use Amazon Ip reputation list AMR in count mode, and then create a subsequent rule based on labels emitted by this AMR to rate limit requests. Or you can create blocking rules on the combination of multiple signals: If the IP is malicious, and flagged by ATP then block. 