---
title: 'Access Control'
metaDesc: 'Certain applications exposes private content to users that authentication and access control. '
socialImage: static-assets/access-control-idp.png
---
## Overview
Certain applications exposes private content to users that authentication and access control. Examples include enterprise internal portal based on Single Page applications, downloading software updates, transferring confidential files, etc.. Companies can implement access control in different ways, such as on the origin versus on the edge.

## Common use cases

### Origin-based access control
When you are not leveraging caching, and you want to leverage the native access control of your origin (e.g. [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html)) instead of building it on the edge with CloudFront, then you can simply use CloudFront as reverse proxy by configuring the `Caching Disabled` [Managed Caching Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html#:~:text=Name%3A%20CachingDisabled) in your distribution. This will get CloudFront to forward every request received from the PoP directly to the origin. You also need to configure the Origin Request Policy to forward to your origin the request attribute carrying the authorization info, such as the `Authorization` header (you can simply  configure the `AllViewer` [Managed Origin Request Policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html#managed-origin-request-policies-list) to forward all request attributes sent by users). 

### CloudFront-based access control using Signed tokens
If your content is cacheable, and you want to offload and scale your access control to CloudFront, then consider enabling [Signed URLS or Signed cookies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html) on CloudFront. To add this method of access control to your workload, follow the [steps explained in the documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-task-list.html):
* Configure a asymmetric cryptographic keys for signing tokens, using [signing key groups](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#choosing-key-groups-or-AWS-accounts)
* In your authentication workflow, append the required token fields in query parameters or cookies of the vended private resource URL. The token will contain an expriry date, the signing key id, the policy and a signature. The policy allows you to define the conditions that needs to be met by a request to be validated by CloudFront. For example, you can use a [custom policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-creating-signed-url-custom-policy.html), to generate a signature that applies to all files wihtin a path.
* Enable signature in the CloudFront's cache behavior that is used for private content. From that point on, all requests will be validated by CloudFront before authorizing them. Un-authorized requests receive a 403 response, that can be customized using Custom Error Page capability.

Use the aws-sdk to generate a working token. As an illustration, the below code in Nodejs generates a CloudFront signed URL for a specific object `edge-image.jpg` valid for two hours. 

``` javascript
const AWS = require('aws-sdk')

// Important: when storing your private key as a string variable, you'll need to replace all line breaks with \n
const cloudfrontAccessKeyId = "K25ULYFPSTHQP9"
const cloudFrontPrivateKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQ....2gvvIH\n-----END RSA PRIVATE KEY-----";
const signer = new AWS.CloudFront.Signer(cloudfrontAccessKeyId, cloudFrontPrivateKey)

// sign a CloudFront URL that expires 2 hours  from now
const signedUrl = signer.getSignedUrl({
  url: 'https://d3jqlnxofenq2x.cloudfront.net/edge-image.jpg',
  expires: Math.floor((Date.now() + 2*60*60*1000)/1000), 
})

console.log(signedUrl);
// output example: https://d3jqlnxofenq2x.cloudfront.net/edge-image.jpg?Expires=1660317158&Key-Pair-Id=K25ULYFP9THQP9&Signature=agW2XF9S5AW0YCc6c7pkCwccJmxaIAWFO~uXn9KtOXtz4JTY7eRF07opJiseGXJxzlMeD4V6FUH8I-gOH~Gvafa16RFV9IryxCyzL9mIYt-XbDKMrY0ONzTWUk2x16AKDK27VoUwEPiI9dpPXMp7f4MsrpKA-u6huZCsulh0~aAYN~x25uNoDO-WgZpfkKFeKc910u4PVnEaKLlZlpuJ0hqWUjMVPes9DfA~msToJeyjrVzLi2R8O8LuuYHsAMAHXr7E9qB8tAoDWz24CurCirxc6sB45Zc-oK9JigX0L4~F~F1TE9i39ysmQF4UrOyu0bp7MKGSDBwLE1P2C3gWNw__
```
In this [Blog](https://aws.amazon.com/blogs/networking-and-content-delivery/signed-cookie-based-authentication-with-amazon-cloudfront-and-aws-lambdaedge-part-1-authentication/), you can learn about a credentials-free solution to authenticate users with emails from trusted domains using CloudFront's signed cookies.

### CloudFront-based custom access control 
When you need a customized access control that is implemented on CloudFront, such as using JWT standard, or including other dimensions in the signature such as the country of the user, then you need to use CloudFront's Edge computing capabilites. Check the following example implementations:
* [CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-function-validate-token.html) to validate JWT token. Note that  CloudFront Functions doesn't allow external network calls, and in consequence, signing keys should be stored in in the function code.
* Lambda@Edge for more advanced implementations, such as [authenticating a Single Page Application hosted on S3](https://aws.amazon.com/blogs/networking-and-content-delivery/securing-cloudfront-distributions-using-openid-connect-and-aws-secrets-manager/), using an integration with an external Identity Provider (IdP) like Cognito.
Securing CloudFront Distributions using OpenID Connect and AWS Secrets Manager

![](/static-assets/access-control-idp.png) 
