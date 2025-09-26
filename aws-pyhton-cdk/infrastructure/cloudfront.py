from aws_cdk import (
    aws_cloudfront as cloudfront,
    aws_iam as iam,
    CfnOutput
)
from constructs import Construct


class CloudFrontDistribution:
    """Manages CloudFront distribution resources."""
    
    def __init__(self, scope: Construct, stack_name: str, account: str, 
                 frontend_bucket, logs_bucket, api_gateway, region: str):
        self.scope = scope
        self.stack_name = stack_name
        self.account = account
        self.frontend_bucket = frontend_bucket
        self.logs_bucket = logs_bucket
        self.api_gateway = api_gateway
        self.region = region
        
        # Create OAC first
        self.oac = self._create_oac()
        
        # Create distribution
        self.distribution = self._create_cloudfront_distribution()
        
        # Add bucket policies AFTER distribution is created
        self._add_bucket_policies()
    
    def _create_oac(self):
        """Create Origin Access Control separately for better dependency management."""
        return cloudfront.CfnOriginAccessControl(
            self.scope, "OAC",
            origin_access_control_config=cloudfront.CfnOriginAccessControl.OriginAccessControlConfigProperty(
                name=f"{self.stack_name}-OAC",
                description="Origin Access Control for S3 bucket access",
                signing_protocol="sigv4",
                signing_behavior="always",
                origin_access_control_origin_type="s3"
            )
        )
    
    def _create_cloudfront_distribution(self):
        """Create CloudFront distribution for frontend with enhanced SPA support."""
        distribution = cloudfront.CfnDistribution(
            self.scope, "FrontendDistribution",
            distribution_config=cloudfront.CfnDistribution.DistributionConfigProperty(
                enabled=True,
                default_root_object="index.html",
                comment=f"{self.stack_name}-Frontend-Distribution",
                origins=[
                    cloudfront.CfnDistribution.OriginProperty(
                        id="S3Origin",
                        domain_name=self.frontend_bucket.bucket_regional_domain_name,
                        origin_access_control_id=self.oac.ref,
                        s3_origin_config=cloudfront.CfnDistribution.S3OriginConfigProperty()
                    )
                ],
                default_cache_behavior=cloudfront.CfnDistribution.DefaultCacheBehaviorProperty(
                    target_origin_id="S3Origin",
                    viewer_protocol_policy="redirect-to-https",
                    compress=True,
                    allowed_methods=["GET", "HEAD", "OPTIONS"],
                    cached_methods=["GET", "HEAD"],
                    smooth_streaming=False,
                    forwarded_values=cloudfront.CfnDistribution.ForwardedValuesProperty(
                        query_string=False,
                        cookies=cloudfront.CfnDistribution.CookiesProperty(forward="none")
                    ),
                    min_ttl=0,
                    default_ttl=86400,
                    max_ttl=31536000
                ),
                cache_behaviors=[
                    cloudfront.CfnDistribution.CacheBehaviorProperty(
                        path_pattern="/auth/*",
                        target_origin_id="S3Origin",
                        viewer_protocol_policy="redirect-to-https",
                        compress=True,
                        allowed_methods=["GET", "HEAD", "OPTIONS"],
                        cached_methods=["GET", "HEAD"],
                        smooth_streaming=False,
                        forwarded_values=cloudfront.CfnDistribution.ForwardedValuesProperty(
                            query_string=False,
                            cookies=cloudfront.CfnDistribution.CookiesProperty(forward="none")
                        ),
                        min_ttl=0,
                        default_ttl=0,
                        max_ttl=0
                    )
                ],
                custom_error_responses=[
                    cloudfront.CfnDistribution.CustomErrorResponseProperty(
                        error_code=404, response_code=200, response_page_path="/index.html", error_caching_min_ttl=0
                    ),
                    cloudfront.CfnDistribution.CustomErrorResponseProperty(
                        error_code=403, response_code=200, response_page_path="/index.html", error_caching_min_ttl=0
                    ),
                    cloudfront.CfnDistribution.CustomErrorResponseProperty(
                        error_code=500, response_code=200, response_page_path="/index.html", error_caching_min_ttl=0
                    )
                ],
                logging=cloudfront.CfnDistribution.LoggingProperty(
                    bucket=self.logs_bucket.bucket_regional_domain_name,
                    prefix="frontend/",
                    include_cookies=False
                ),
                http_version="http2",
                ipv6_enabled=False,
                price_class="PriceClass_100",
                web_acl_id=None
            )
        )
        
        return distribution
    
    def _add_bucket_policies(self):
        """Add bucket policies for CloudFront access after distribution is created."""
        # Frontend bucket policy for CloudFront OAC
        self.frontend_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                sid="AllowCloudFrontServicePrincipal",
                effect=iam.Effect.ALLOW,
                actions=["s3:GetObject"],
                resources=[f"{self.frontend_bucket.bucket_arn}/*"],
                principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
                conditions={
                    "StringEquals": {
                        "AWS:SourceAccount": self.account
                    },
                    "StringLike": {
                        "AWS:SourceArn": f"arn:aws:cloudfront::{self.account}:distribution/{self.distribution.ref}"
                    }
                }
            )
        )
        
        # Logs bucket policy for CloudFront logging
        self.logs_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                sid="AllowCloudFrontLogDelivery",
                effect=iam.Effect.ALLOW,
                actions=["s3:PutObject"],
                resources=[f"{self.logs_bucket.bucket_arn}/frontend/*"],
                principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
                conditions={
                    "StringEquals": {
                        "AWS:SourceAccount": self.account
                    }
                }
            )
        )
        
        # Also allow CloudFront to get bucket ACL for logging
        self.logs_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                sid="AllowCloudFrontGetBucketAcl",
                effect=iam.Effect.ALLOW,
                actions=["s3:GetBucketAcl"],
                resources=[self.logs_bucket.bucket_arn],
                principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
                conditions={
                    "StringEquals": {
                        "AWS:SourceAccount": self.account
                    }
                }
            )
        )