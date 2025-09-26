#!/usr/bin/env python3
"""
CDK App Entry Point for Marcos MVP Application - Service-Based Organization
"""

from aws_cdk import App, Environment
from infrastructure import MarcosMvpSecureStack
from dotenv import load_dotenv
import sys
import os
import config

# Load environment variables from .env file
load_dotenv()

# Get environment from command line or default to 'dev'
environment = sys.argv[1] if len(sys.argv) > 1 else 'dev'

app = App()

try:
    # Create the Marcos MVP stack with service-based organization
    MarcosMvpSecureStack(app, f"{config.STACK_NAME}",
        env=Environment(
            account=app.node.try_get_context("account") or os.environ.get("CDK_DEFAULT_ACCOUNT"),
            region=app.node.try_get_context("region") or os.environ.get("CDK_DEFAULT_REGION")
        ),
        description=f"Marcos MVP Stack with Terra Integration - {environment} environment"
    )
    
    print(f"✅ Created Marcos MVP Stack for environment: {environment}")
    print("📁 Infrastructure organized by AWS service:")
    print("   - s3.py: S3 bucket resources")
    print("   - dynamodb.py: DynamoDB table resources")
    print("   - lambda_functions.py: Lambda functions and layers")
    print("   - cognito.py: Cognito authentication")
    print("   - api_gateway.py: API Gateway configuration")
    print("   - cloudfront.py: CloudFront distribution")
    print("   - kms.py: KMS encryption keys")
    print("   - ssm.py: SSM Parameter Store")
    print("   - cloudwatch.py: CloudWatch monitoring")
    
except Exception as e:
    print(f"❌ Error creating stack: {e}")
    sys.exit(1)

app.synth()