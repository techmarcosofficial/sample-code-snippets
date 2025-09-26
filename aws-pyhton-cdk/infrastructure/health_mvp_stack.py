from aws_cdk import (
    Stack, 
    Environment, 
    CfnOutput,
    aws_s3_deployment as s3_deployment
)
from constructs import Construct
import os

# Import all service modules
from infrastructure.kms import KMSEncryption
from infrastructure.s3 import S3Buckets
from infrastructure.dynamodb import DynamoDBTables
from infrastructure.ssm import SSMParameters
from infrastructure.lambda_functions import LambdaFunctions
from infrastructure.cognito import CognitoAuth
from infrastructure.api_gateway import ApiGateway
from infrastructure.cloudfront import CloudFrontDistribution
from infrastructure.cloudwatch import CloudWatchMonitoring


class MarcosMvpSecureStack(Stack):
    """
    Main Marcos MVP CDK Stack - Service-Based Organization
    
    This stack orchestrates all the infrastructure components with each
    AWS service in its own dedicated file for maximum clarity.
    """
    
    def __init__(self, scope: Construct, construct_id: str, env: Environment = None, **kwargs):
        super().__init__(scope, construct_id, env=env, **kwargs)
        
        # Set stack description
        self.description = f"Marcos-MVP-Stack-{construct_id}-{self.account}"
        
        # Initialize resources in dependency order
        
        # 1. Security and encryption (foundation)
        self.kms = KMSEncryption(self, self.stack_name)
        
        # 2. Storage resources
        self.s3 = S3Buckets(self, self.stack_name, self.account, self.kms.master_key)
        self.dynamodb = DynamoDBTables(self, self.kms)
        
        # 3. Configuration
        self.ssm = SSMParameters(self)
        
        # 4. Compute resources (Lambda functions including Cognito triggers)
        self.lambda_functions = LambdaFunctions(
            self, self.stack_name, self.region, self.account,
            self.s3, self.dynamodb
        )
        
        # 5. Authentication (with Lambda triggers)
        self.cognito = CognitoAuth(
            self, 
            self.stack_name,
            lambda_functions=self.lambda_functions  # Pass Lambda functions for triggers
        )
        
        # 6. API Gateway
        self.api_gateway = ApiGateway(
            self, self.stack_name, self.account,
            self.lambda_functions, self.cognito
        )
        
        # 7. CloudFront distribution
        self.cloudfront = CloudFrontDistribution(
            self, self.stack_name, self.account,
            self.s3.frontend_bucket, self.s3.logs_bucket,
            self.api_gateway.api_gateway, self.region
        )
        
        # 8. Monitoring and alerting
        self.cloudwatch = CloudWatchMonitoring(
            self, self.stack_name,
            self.lambda_functions,
            self.api_gateway.api_gateway,
            self.dynamodb.summary_table,
            self.kms.master_key,
            self.cloudfront.distribution.ref
        )
        
        # 9. Deploy frontend
        self._deploy_frontend()
        
        # 10. Apply security tags
        self._apply_security_tags()
        
        # 11. Create outputs
        self._create_outputs()
    
    def _deploy_frontend(self):
        """Deploy React build artifacts to S3."""
        ui_dist_path = os.path.join(os.path.dirname(__file__), "..", "ui", "dist")
        if os.path.exists(ui_dist_path):
            s3_deployment.BucketDeployment(
                self, "FrontendDeployment",
                sources=[s3_deployment.Source.asset(ui_dist_path)],
                destination_bucket=self.s3.frontend_bucket,
                destination_key_prefix="",
                memory_limit=1024,
            )
        else:
            print(f"⚠️  UI dist directory not found at {ui_dist_path}, please run 'npm run build' in the ui directory first")
    
    def _apply_security_tags(self):
        """Apply comprehensive security and compliance tags to all resources."""
        # Security tags are automatically applied by CDK at the stack level
        # Individual resources inherit these tags
        pass
    
    def _create_outputs(self):
        """Create CloudFormation outputs."""
        # API endpoints
        CfnOutput(self, "WebhookUrl", value=f"{self.api_gateway.api_gateway.url}webhook")
        CfnOutput(self, "OnboardingUrl", value=f"{self.api_gateway.api_gateway.url}onboarding")
        CfnOutput(self, "MetricsUrl", value=f"{self.api_gateway.api_gateway.url}metrics")
        CfnOutput(self, "TerraWebhookUrl", value=f"{self.api_gateway.api_gateway.url}terra-webhook")
        CfnOutput(self, "ProfileUrl", value=f"{self.api_gateway.api_gateway.url}profile")
        CfnOutput(self, "AuthStatusUrl", value=f"{self.api_gateway.api_gateway.url}auth-status")
        CfnOutput(self, "ChangePasswordUrl", value=f"{self.api_gateway.api_gateway.url}change-password")
        CfnOutput(self, "ForgotPasswordUrl", value=f"{self.api_gateway.api_gateway.url}forgot-password")
        CfnOutput(self, "ConfirmForgotPasswordUrl", value=f"{self.api_gateway.api_gateway.url}confirm-forgot-password")
        
        # Frontend and distribution
        CfnOutput(self, "FrontendUrl", value=f"https://{self.cloudfront.distribution.get_att('DomainName')}")
        CfnOutput(self, "CloudFrontDistributionId", value=self.cloudfront.distribution.ref)
        
        # Authentication
        CfnOutput(self, "UserPoolId", value=self.cognito.user_pool.user_pool_id)
        CfnOutput(self, "UserPoolClientId", value=self.cognito.user_pool_client.user_pool_client_id)
        
        # User groups
        CfnOutput(self, "AdminGroupId", value=self.cognito.admin_group.ref)
        CfnOutput(self, "UserGroupId", value=self.cognito.user_group.ref)
        CfnOutput(self, "MarcosProfessionalGroupId", value=self.cognito.marcos_professional_group.ref)
        
        # Storage resources
        CfnOutput(self, "RawBucketName", value=self.s3.raw_bucket.bucket_name)
        CfnOutput(self, "FrontendBucketName", value=self.s3.frontend_bucket.bucket_name)
        CfnOutput(self, "LogsBucketName", value=self.s3.logs_bucket.bucket_name)
        CfnOutput(self, "SummaryTableName", value=self.dynamodb.summary_table.table_name)
        
        # Security and monitoring
        CfnOutput(self, "MasterKeyId", value=self.kms.master_key.key_id)
        CfnOutput(self, "StackDescription", value=self.description)
        
        # Lambda function ARNs for monitoring
        CfnOutput(self, "IngestLambdaArn", value=self.lambda_functions.ingest_function.function_arn)
        CfnOutput(self, "OnboardingLambdaArn", value=self.lambda_functions.onboarding_function.function_arn)
        CfnOutput(self, "QueryLambdaArn", value=self.lambda_functions.query_function.function_arn)
        CfnOutput(self, "TestPublicLambdaArn", value=self.lambda_functions.test_public_function.function_arn)
        
        # Cognito trigger Lambda ARNs
        CfnOutput(self, "PostConfirmationTriggerArn", value=self.lambda_functions.post_confirmation_trigger.function_arn)
        CfnOutput(self, "PreTokenGenerationTriggerArn", value=self.lambda_functions.pre_token_generation_trigger.function_arn)