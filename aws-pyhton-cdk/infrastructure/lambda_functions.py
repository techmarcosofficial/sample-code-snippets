from aws_cdk import (
    aws_lambda as _lambda,
    aws_iam as iam,
    Duration
)
from constructs import Construct
import config

class LambdaFunctions:
    """Manages all Lambda function resources."""
    
    def __init__(self, scope: Construct, stack_name: str, region: str, account: str, s3_buckets, dynamodb_tables, cloudfront_url=None):
        
        self.scope = scope
        self.stack_name = stack_name
        self.region = region
        self.account = account
        self.s3_buckets = s3_buckets
        self.dynamodb_tables = dynamodb_tables
        self.cloudfront_url = cloudfront_url
        
        # Create layers first
        self.common_layer = self._create_common_layer()
        self.terra_layer = self._create_terra_layer()
        
        # Create Lambda functions
        self.ingest_function = self._create_ingest_function()
        self.onboarding_function = self._create_onboarding_function()
        self.query_function = self._create_query_function()
        self.test_public_function = self._create_test_public_function()
        
        # Create Cognito trigger functions
        self.post_confirmation_trigger = self._create_post_confirmation_trigger()
        self.pre_token_generation_trigger = self._create_pre_token_generation_trigger()
    
    def _create_common_layer(self) -> _lambda.LayerVersion:
        """Create common Lambda layer."""
        return _lambda.LayerVersion(
            self.scope, "CommonLayer",
            code=_lambda.Code.from_asset("layers/common"),
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_12],
            description="Common deps for onboarding/query Lambdas"
        )
    
    def _create_terra_layer(self) -> _lambda.LayerVersion:
        """Create Terra Lambda layer."""
        return _lambda.LayerVersion(
            self.scope, "TerraLayer",
            code=_lambda.Code.from_asset("layers/terra/terra_layer.zip"),
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_12],
            description="Terra SDK + dependencies"
        )
    
    def _create_ingest_function(self) -> _lambda.Function:
        """Create ingest Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "IngestLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="ingest_lambda.handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )

        
        self._grant_ingest_permissions(lambda_func)
        return lambda_func
    
    def _create_onboarding_function(self) -> _lambda.Function:
        """Create onboarding Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "OnboardingLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="onboarding_lambda.lambda_handler",
            timeout=Duration.seconds(60),
            memory_size=512,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
                "TERRA_USERS_TABLE": self.dynamodb_tables.terra_users_table.table_name,
                "ONBOARDING_TABLE": self.dynamodb_tables.onboarding_table.table_name,
                "MAPPING_TABLE": self.dynamodb_tables.user_mapping_table.table_name,
                "FRONTEND_BASE_URL": "https://marcos.cloudfront.net",
                "STACK_NAME": f"MarcosMvpStack-{config.ENVIRONMENT.capitalize()}-{config.NUMBER}",
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )
        
        self._grant_onboarding_permissions(lambda_func)
        return lambda_func
    
    def _create_query_function(self) -> _lambda.Function:
        """Create query Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "QueryLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="query_lambda.handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )
        
        self._grant_query_permissions(lambda_func)
        return lambda_func
    
    def _create_test_public_function(self) -> _lambda.Function:
        """Create test public Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "TestPublicLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="test_public_lambda.handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )
        
        self._grant_test_public_permissions(lambda_func)
        return lambda_func
    
    def _create_post_confirmation_trigger(self) -> _lambda.Function:
        """Create Cognito post-confirmation trigger Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "PostConfirmationTrigger",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="cognito_triggers.post_confirmation_handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )
        
        self._grant_post_confirmation_permissions(lambda_func)
        return lambda_func
    
    def _create_pre_token_generation_trigger(self) -> _lambda.Function:
        """Create Cognito pre-token generation trigger Lambda function."""
        lambda_func = _lambda.Function(
            self.scope, "PreTokenGenerationTrigger",
            runtime=_lambda.Runtime.PYTHON_3_12,
            code=_lambda.Code.from_asset("lambda"),
            handler="cognito_triggers.pre_token_generation_handler",
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "RAW_BUCKET": self.s3_buckets.raw_bucket.bucket_name,
                "SUMMARY_TABLE": self.dynamodb_tables.summary_table.table_name,
            },
            layers=[self.common_layer],
            tracing=_lambda.Tracing.ACTIVE,
        )
        
        self._grant_pre_token_generation_permissions(lambda_func)
        return lambda_func
    
    def _grant_ingest_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to ingest Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read_write(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_write_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
    
    def _grant_onboarding_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to onboarding Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read_write(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_write_data(lambda_func)
        self.dynamodb_tables.terra_users_table.grant_read_write_data(lambda_func)
        self.dynamodb_tables.onboarding_table.grant_read_write_data(lambda_func)
        self.dynamodb_tables.user_mapping_table.grant_read_write_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
    
    def _grant_query_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to query Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
    
    def _grant_test_public_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to test public Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
    
    def _grant_post_confirmation_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to post-confirmation trigger Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read_write(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_write_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
    
    def _grant_pre_token_generation_permissions(self, lambda_func: _lambda.Function):
        """Grant permissions to pre-token generation trigger Lambda function."""
        # S3 permissions
        self.s3_buckets.raw_bucket.grant_read_write(lambda_func)
        
        # DynamoDB permissions
        self.dynamodb_tables.summary_table.grant_read_write_data(lambda_func)
        
        # SSM permissions
        lambda_func.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ssm:GetParameter", "ssm:GetParameters"],
                resources=[f"arn:aws:ssm:{self.region}:{self.account}:parameter/{config.STACK}/*"]
            )
        )
