from aws_cdk import (
    aws_s3 as s3,
    aws_kms as kms,
    RemovalPolicy,
    Duration
)
from constructs import Construct
import config

class S3Buckets:
    """Manages all S3 bucket resources."""
    
    def __init__(self, scope: Construct, stack_name: str, account: str, master_key: kms.Key):
        self.scope = scope
        self.stack_name = stack_name
        self.account = account
        self.master_key = master_key
        
        # Create buckets in correct order (logs first)
        self.logs_bucket = self._create_logs_bucket()
        self.raw_bucket = self._create_raw_bucket()
        self.frontend_bucket = self._create_frontend_bucket()
    
    def _create_logs_bucket(self) -> s3.Bucket:
        """Create logs bucket for CloudFront and access logging."""
        return s3.Bucket(
            self.scope, "LogsBucket",
            encryption=s3.BucketEncryption.KMS,
            encryption_key=self.master_key,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            enforce_ssl=True,
            versioned=False,
            removal_policy=RemovalPolicy.RETAIN,
            object_ownership=s3.ObjectOwnership.OBJECT_WRITER,
            access_control=s3.BucketAccessControl.LOG_DELIVERY_WRITE,
        )
    
    def _create_raw_bucket(self) -> s3.Bucket:
        """Create raw data bucket with KMS encryption."""
        return s3.Bucket(
            self.scope, "RawDataBucket",
            encryption=s3.BucketEncryption.KMS,
            encryption_key=self.master_key,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            enforce_ssl=True,
            versioned=False,
            removal_policy=RemovalPolicy.RETAIN,
            access_control=s3.BucketAccessControl.PRIVATE,
            object_ownership=s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            server_access_logs_bucket=self.logs_bucket,
            server_access_logs_prefix="raw-bucket-access-logs/",
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="TransitionToIA",
                    enabled=True,
                    transitions=[
                        s3.Transition(
                            storage_class=s3.StorageClass.INFREQUENT_ACCESS,
                            transition_after=Duration.days(30)
                        ),
                        s3.Transition(
                            storage_class=s3.StorageClass.GLACIER,
                            transition_after=Duration.days(90)
                        )
                    ]
                )
            ]
        )
    
    def _create_frontend_bucket(self) -> s3.Bucket:
        """Create frontend bucket for React UI."""
        return s3.Bucket(
            self.scope, "FrontendBucket",
            bucket_name=f"{config.STACK.lower()}-dev-frontend-{self.account}",
            encryption=s3.BucketEncryption.KMS,
            encryption_key=self.master_key,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            enforce_ssl=True,
            versioned=False,
            removal_policy=RemovalPolicy.RETAIN,
            access_control=s3.BucketAccessControl.PRIVATE,
            object_ownership=s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            server_access_logs_bucket=self.logs_bucket,
            server_access_logs_prefix="frontend-bucket-access-logs/",
            public_read_access=False
        )