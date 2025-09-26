"""
Infrastructure package for Marcos MVP CDK stack.

This package contains all the infrastructure components organized by AWS service:
- s3.py: S3 bucket resources
- dynamodb.py: DynamoDB table resources  
- lambda_functions.py: Lambda functions and layers
- cognito.py: Cognito authentication resources
- api_gateway.py: API Gateway configuration
- cloudfront.py: CloudFront distribution
- kms.py: KMS encryption keys
- ssm.py: SSM Parameter Store
- cloudwatch.py: CloudWatch alarms and metrics
- marcos_mvp_stack.py: Main stack orchestrator

Each module is self-contained and follows the single responsibility principle
for better maintainability and testing.
"""

from .marcos_mvp_stack import MarcosMvpSecureStack

__all__ = ["MarcosMvpSecureStack"]