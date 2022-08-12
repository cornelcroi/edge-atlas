---
title: 'Security governance at scale'
metaDesc: 'In large organizations with many teams working on different web applications, there is a need for governing security controls with Firewall Manager in a consistent way, to avoid for example endpoints with weak or no protections.'
socialImage: static-assets/thumbnail-edge.png
---
## Overview
In large organizations with many teams working on different web applications, there is a need for governing security controls in a consistent way, to avoid for example endpoints with weak or no protections. Organizations can leverage Firewall Manager to deploy WAF protection and Shield Advanced at scale, with a centrally defined governance, and a visibility to how this governance is implemented.

## Firewall Manager
Firewall Manager allows organization to define WAF or Shield Advanced policies that will be deployed automatically across their resources. A policy consists of:
* **A policy scope**, that defines where it applies: What type of resources (CloudFront, ALB, etc..)? include or exclude resources with specific tags? which accounts or organizational units to include or exclude? 
* **Policy rules**: which WAF rules to apply? enable logging centrally? add Shield Advanced protections?
* **Policy action**: Automatically apply policy rules on resources within a scope or just identify it? In an initial Firewall Manager deployment, it's recommended to start without auto remediation, to identify any resources requiring special handling to avoid disturbing existing applications. With a higher confidence attained, you can switch to auto remediation action.

## WAF deployments
When you create a WAF policy, Firewall Manager will create a WAF WebACL with the defined WAF rules in the AWS Accounts on which the policy scope applies. In a WAF policy, you can define two types of rule groups that will be added to the created WebACL:
* A first rule group, whose rules will be always evaluated first. 
* A Last rule group, whose rules will be evaluated at the end.

That allows a central security team to deploy common rules across their organization, and give application teams the possibility to add their own rules between the first and last common rule groups. Since rules in AWS WAF are evaluated by order, the common first rule group will be applied first, then the rules created by the application teams, and finally the common last rule group.

Customers can set up a CI/CD pipeline to update the WAF rules in the AWS WAF policy, which will be deployed within minutes by Firewall Manager across the organization. In this [blog](https://aws.amazon.com/blogs/architecture/field-notes-how-olx-europe-fights-millions-of-bots-with-aws/) you can learn about how OLX deployed a central WAF policy using a CI/CD pipeline, with a central logging system.

## Common WAF governance models
Firewall Manager is a flexible tool that allows you to enforce different security governance strategy that depends on the needs of your organization. In any centralized security governance, you need to make a tradeoff between how much you enforce rules centrally to reduce overall false negatives, versus how much you want to handle false positives caused by central rules. This tradeoff will depend on your organization: Heterogenous applications, appetite for false negatives, tolerance of false positives, autonomy of application teams, etc… Below you can learn about common WAF governance models.

### Single policy for critical threats
When you have highly autonomous application teams, and you have a low tolerance for false positives, you can create a single WAF policy that addresses critical threats. For example, you can create WAF rules based on rate limits with high thresholds, combined with IP reputation lists and geo-blocking rules for embargoed countries. Such rules have very low false-positives rate when set up properly. For your application teams, it's recommended to create an internal wiki with guidance on best practices in terms of what rules they should be adding to their WebACL to protect their application from other types of threats. For example, guide them to add protections against SQLi and XSS attacks if their application is vulnerable to them. 

### Single policy for a wider landscape of threats
When you have a low appetite for false negatives, and you'd like to cover more threats using the central policy, you can enforce a central policy with common protections, but give the application teams the possibility to manage false positives autonomously. This will shift the frontiers of the responsibility of maintaining WAF rules to the central security team. To implement this WAF governance model:
* Put your rules in the first rule group of the WAF policy in count mode. These rules will only be emitting labels.
* Use the last rule group of the WAf policy to block requests matching these labels.

If your application teams encounter false positives, they can create exclusion rules using the labels emitted by your rules. For example, let's say you have enabled Amazon Managed Rules (AMR) for protecting against SQLi in count mode in the first rule group. In the last rule group, you'd add a blocking rule that matches the labels emitted by the previously mentioned AMR (`label_matched=”SQLi_BODY”`). If at some point, this causes a false positive on a specific url (`url=”/form1”`), the the application team can create an exclusion rule in the WebACL that allows this request (`IF url=”/form1” AND label_matched=”SQLi_BODY” then ALLOW`). The allow rule action is terminating, and will stop evaluating the subsequent blocking rules.

To roll out changes to this policy without impacting existing applications, you can create a replica of this policy to be used in staging by application teams. Both policies need to have a mutually exclusive scope. For example, production policy applies to all CloudFront distribution except those with `staging`tag, and the staging policy to all CloudFront distributions with the `staging` tag. For most updates, you can first roll them out to the staging policy, and notify all application teams using for example SNS. Once notified of a change, application teams test the new policy in their staging environment, which can be automated, and handle false positives if needed. Then after a week, the central team propagate the change to the production policy. Of course, for critical updates, such as protections against Log4j risk, can be applied immediately at the expense of some false positives temporary, until the application teams create exceptions.

### Multiple policies with different profiles
If you want to cover a wide range threats like in the previous scenario, but you want to shift managing false positives more to the central team to offload further the application teams, then you can create a catalog of policies that vary by application and levels of appetite for false negatives. For example, you can can create a policy dedicated to protect Wordpress applications, and another one to protect PHP applications with an SQL database. For the latter, you can create two versions of it, one with high sensitivity for blocking SQLi attacks, and another one with a lower sensitivity. The scope of each policy will be defined by a specific tag. Application teams just need to check the catalog of available protections, and apply the tag of the protection that is most suited for their application type, and their appetite for false negatives/false positives. When updating WAF rules in the central policies, the security team can apply the same concept described previously round staging policies.

This pattern can be taken to the extreme, where the central security team can create a dedicated and custom policy for each application team. In this model, the central security team is completely responsible for managing the WAf rules for each application teams. 

## Additional resources
* TODO Issue brought by WAF limits
* TODO regional vs global deployment
* TOO conditions for FMS config (price optimization), org, etc..







