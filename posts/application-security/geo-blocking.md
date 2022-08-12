---
title: 'Geo-blocking'
metaDesc: 'Companies implement geo-blocking policies on web applications for different purposes (e.g. regulatory with embargoed countries).'
socialImage: static-assets/thumbnail-edge.png
---
## Overview
Companies implement geo-blocking policies on their web applications for different purposes, whether regulatory to block embargoed countries or to enforce content delivery exclusively in the countries where have licence to. AWS edge services allow developers to implement geo-blocking in different ways, according to the granularity needed and acceptable cost of the solution.

## Common use cases

### Simple policy for all traffic at not additional cost
Use CloudFront geographic restrictions to restrict countries at the distribution level at no additional cost. You can allow or block a specific set of countries, applied to all the traffic received by your CloudFront distribution. Viewers who are restricted by the configured geographic restrictions will receive a 403 Forbidden response by CloudFront. You can use CloudFront's Custom Error Pages to serve a friendly error page.

### Extending WAF WebACL with geo based rules
If you are already using WAF to protect your distribution, you can add a [geo-match](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-geo-match.html) rule to your WebACL to control at granular level what action to take based on the country of the viewer. Examples include:
* Only apply geo-matching to a URL pattern
* Rate limiting or challenging with Captcha instead of just Allowing/Blocking
* [Excluding certain IPs](https://docs.aws.amazon.com/waf/latest/developerguide/classic-web-acl-ip-conditions.html) from the blocking policy

### Sophisticated geo-blocking logic
Use CloudFront Functions to restrict countries at the CloudFront cache behavior level, and/or exercise more granular restrictions regionally (e.g., example below to block viewers from Donetsk (14) or Luhansk (9) regions of Ukraine). To implement this approach:
* Associate the function to the viewer request event
* The function can contain conditional statements to restrict access at the country and/or region level. To use this, you must allow list the needed headers (e.g., CloudFront-Viewer-Country and CloudFront-Viewer-Country-Region) by attaching an origin request policy to the cache behavior that should have this blocking enabled.

``` javascript
function handler(event) {
    var request = event.request;
    var country = request.headers['cloudfront-viewer-country'];
    var region = request.headers['cloudfront-viewer-country-region'];

    if (country && country.value === 'UA' && region && (region.value === '9' || region.value === '14')) {
        return {
            statusCode: 403,
            statusDescription: 'Forbidden'
        };
    }
    return request;
}
```

## Additional resources
* TODO CloudFront and WAF determine the location of viewers by using a third-party geo-location database. The accuracy of the mapping between IP addresses and countries varies by region. 
* TODO waf granularity
* TODO This can be used independently or combined with the previous approaches. When combined, requests that make it through the geographic blocking / WAF can be further evaluated by a CloudFront Function. Refer to CloudFront pricing for details on cost.