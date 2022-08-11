import React from "react";
import Image from 'next/image';

const Home = () => {
  return (
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0'>
        
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/about-aws/whats-new/2022/07/aws-waf-sensitivity-levels-sql-injection-rule-statements/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>AWS WAF adds sensitivity levels for SQL injection rule statements</b></h1>
              <p className='p-2'>Jul 26, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/about-aws/whats-new/2022/07/amazon-cloudfront-header-names-1024-characters-cloudfront-policies/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>Amazon CloudFront supports header names of up to 1024 characters in CloudFront policies</b></h1>
              <p className='p-2'>Jul 11, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/about-aws/whats-new/2022/06/aws-waf-captcha-generally-available/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>AWS WAF Captcha is now generally available</b></h1>
              <p className='p-2'>Jun 21, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://reinvent.awsevents.com/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>Coming event: Re:Invent 2022</b></h1>
              <p className='p-2'>Nov 28, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/blogs/networking-and-content-delivery/well-architecting-online-applications-with-cloudfront-and-aws-global-accelerator/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>Well-Architecting online applications with CloudFront and AWS Global Accelerator</b></h1>
              <p className='p-2'>Jul 26, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/blogs/security/enable-post-quantum-key-exchange-in-quic-with-the-s2n-quic-library/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>Enable post-quantum key exchange in QUIC with the s2n-quic library</b></h1>
              <p className='p-2'>Jul 25, 2022</p>
            </a>
          </div>
          <div className='border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col'>
            <a href="https://aws.amazon.com/blogs/networking-and-content-delivery/using-amazon-cloudfront-and-amazon-s3-to-build-multi-region-active-active-geo-proximity-applications/" target="_blank">
              <img width={650} height={340} src={`static-assets/thumbnail-edge.png`}/>
              <h1 className='p-4'><b>Using Amazon CloudFront and Amazon S3 to build multi-Region active-active geo proximity applications</b></h1>
              <p className='p-2'>Jul 19, 2022</p>
            </a>
          </div>
      </div>
    );

};

export default Home;