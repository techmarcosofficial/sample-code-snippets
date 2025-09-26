from aws_cdk import (
    aws_kms as kms,
    aws_iam as iam,
    Duration,
    RemovalPolicy,
    Tags,
    Stack
)
from constructs import Construct
import config

class KMSEncryption:
    """Manages KMS encryption resources."""
    
    def __init__(self, scope: Construct, stack_name: str, account: str = None):
        self.scope = scope
        self.stack_name = stack_name
        # Get account from stack if not provided
        self.account = account or Stack.of(scope).account
        self.master_key = self._create_master_key()
    
    def _create_master_key(self) -> kms.Key:
        """Create master KMS key for encryption with enhanced security and CloudFront support."""
        key = kms.Key(
            self.scope, "MasterKey",
            enable_key_rotation=True,
            description="Master KMS key for Marcos MVP data encryption",
            removal_policy=RemovalPolicy.RETAIN,
            pending_window=Duration.days(7),
            key_spec=kms.KeySpec.SYMMETRIC_DEFAULT,
            key_usage=kms.KeyUsage.ENCRYPT_DECRYPT,
            policy=iam.PolicyDocument(
                statements=[
                    # Allow root account full access
                    iam.PolicyStatement(
                        sid="Enable IAM User Permissions",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.AccountRootPrincipal()],
                        actions=["kms:*"],
                        resources=["*"]
                    ),
                    # Allow CloudFront service to use the key for S3 access
                    iam.PolicyStatement(
                        sid="Allow CloudFront Service",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    ),
                    # Allow S3 service to use the key
                    iam.PolicyStatement(
                        sid="Allow S3 Service",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("s3.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    ),
                    # Allow SSM service access
                    iam.PolicyStatement(
                        sid="Allow SSM Service",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("ssm.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    ),
                    # Allow CloudWatch Logs
                    iam.PolicyStatement(
                        sid="Allow CloudWatch Logs",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("logs.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    )
                ]
            )
        )
        
        # Add key alias for easier reference
        key.add_alias(f"alias/{self.stack_name}-master-key")
        
        return key
    
    def _create_dynamodb_key(self) -> kms.Key:
        """Create customer-managed KMS key for DynamoDB encryption."""
        key = kms.Key(
            self.scope, "DynamoDBEncryptionKey",
            description="Customer-managed key for DynamoDB marcos data encryption",
            enable_key_rotation=True,
            removal_policy=RemovalPolicy.RETAIN,
            policy=iam.PolicyDocument(
                statements=[
                    # Allow root account full access
                    iam.PolicyStatement(
                        sid="Enable IAM User Permissions",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.AccountRootPrincipal()],
                        actions=["kms:*"],
                        resources=["*"]
                    ),
                    # Allow DynamoDB service to use the key
                    iam.PolicyStatement(
                        sid="Allow DynamoDB Service",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("dynamodb.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    ),
                    # Allow CloudWatch Logs
                    iam.PolicyStatement(
                        sid="Allow CloudWatch Logs",
                        effect=iam.Effect.ALLOW,
                        principals=[iam.ServicePrincipal("logs.amazonaws.com")],
                        actions=[
                            "kms:Encrypt",
                            "kms:Decrypt",
                            "kms:ReEncrypt*",
                            "kms:GenerateDataKey*",
                            "kms:DescribeKey"
                        ],
                        resources=["*"],
                        conditions={
                            "StringEquals": {
                                "AWS:SourceAccount": self.account
                            }
                        }
                    )
                ]
            )
        )
        
        # Add tags for compliance
        Tags.of(key).add("DataClassification", "PHI")
        Tags.of(key).add("Compliance", "HIPAA")
        Tags.of(key).add("Environment", config.STAGE)
        
        return key