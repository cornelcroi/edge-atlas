---
title: 'Video Streaming Architectures'
metaDesc: 'AWS services can be used to deliver massive video-on-demand catalogs or live stream content to millions of viewers'
socialImage: static-assets/video-streaming-vod.png
---
## Overview
AWS services can be used to deliver massive video-on-demand catalogs or live stream content to millions of viewers. The architecture of the solution will depend on the use case (e.g. VoD versus Live), and the business requirements (e.g. level of redundancy, ad insertion, etc..). In all cases, the architecture will have a video processing component, an originating server component and CloudFront for the content delivery.

## Common use cases

### Video-On-Demand (VoD)
To get started with a VoD solution on AWS, deploy this [AWS Solution](https://aws.amazon.com/solutions/implementations/video-on-demand-on-aws/). This solution uses the following main AWS services to build a highly available and resilient architecture:
* S3 to store the mezzanine video files
* MediaConvert to transcode media files from their source format into versions that play back smartphones, tablets, PCs and other devices.
* MediaPackage (optional) to create video streams formatted to play on several devices from a single video input.
* CloudFront for content delivery.
* Other serverless components such as SQS, Lambda and SNS to orchestrate the video processing workflow.

![](/static-assets/video-streaming-vod.png)

### Live Streaming
To get started with a Live Streaming solution on AWS, deploy this [AWS Solution](https://aws.amazon.com/solutions/implementations/live-streaming-on-aws/). The solution’s CloudFormation template launches the following main AWS services and services necessary to ingest, transcode, and deliver live streaming video:
* MediaLive, which ingests two input feeds and transcodes your content into two adaptive bitrate (ABR) HTTP Live Streaming (HLS) streams as output.
* MediaPackage ingests the MediaLive ABR output and packages the live stream into HLS, Dynamic Adaptive Streaming over HTTP (DASH), and Common Media Application Format (CMAF) formats that are delivered to three MediaPackage custom endpoints.
* A CloudFront distribution is configured to use the MediaPackage custom endpoints as its origin and includes a CDN identifier custom HTTP header to authenticate requests. MediaPackage only fulfills playback requests that are authorized between MediaPackage and CloudFront using the CDN Identifier. This CDN Identifier is created as part of the CloudFormation deployment and securely stored in AWS Secrets Manager.
* CloudFront for content delivery.

![](/static-assets/video-streaming-live.png)

## Additional resources
TODO ad insertion
TODO Managed cache policies
