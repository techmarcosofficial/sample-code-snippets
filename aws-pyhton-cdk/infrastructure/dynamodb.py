from aws_cdk import (
    aws_dynamodb as dynamodb,
    RemovalPolicy
)
from constructs import Construct
import config

class DynamoDBTables:
    """Manages all DynamoDB table resources."""
    
    def __init__(self, scope: Construct, kms_encryption):
        self.scope = scope
        # Use the KMS key from the KMSEncryption instance
        self.kms_key = kms_encryption._create_dynamodb_key()
        
        self.summary_table = self._create_summary_table()
        self.terra_users_table = self._create_terra_users_table()
        self.user_mapping_table = self._create_user_mapping_table()
        self.onboarding_table = self._create_onboarding_table()

    
    def _create_summary_table(self) -> dynamodb.Table:
        """Create DynamoDB table for per-user daily summaries."""
        table = dynamodb.Table(
            self.scope, "SummaryTable",
            partition_key=dynamodb.Attribute(name="pseudonym_id", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="date", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
            removal_policy=RemovalPolicy.RETAIN,
            stream=dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=self.kms_key,
            
            # CRITICAL: Deletion protection
            deletion_protection=True,
        )
        
        table.add_global_secondary_index(
            index_name="DateIndex",
            partition_key=dynamodb.Attribute(name="date", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="pseudonym_id", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )
        
        return table
    
    def _create_terra_users_table(self) -> dynamodb.Table:
        """Create DynamoDB table for Terra user mapping."""
        table = dynamodb.Table(
            self.scope, "TerraUsers",
            partition_key=dynamodb.Attribute(name="terra_user_id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
            removal_policy=RemovalPolicy.RETAIN,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=self.kms_key,
            
            # CRITICAL: Deletion protection
            deletion_protection=True,
        )
        
        table.add_global_secondary_index(
            index_name="cognito_sub-index",
            partition_key=dynamodb.Attribute(name="cognito_sub", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )
        
        return table
    
    def _create_user_mapping_table(self) -> dynamodb.Table:
        """Create DynamoDB table for user mapping."""
        table = dynamodb.Table(
            self.scope, "UserMapping",
            partition_key=dynamodb.Attribute(name="cognito_sub", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
            removal_policy=RemovalPolicy.RETAIN,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=self.kms_key,
            
            # CRITICAL: Deletion protection
            deletion_protection=True,
        )
        
        table.add_global_secondary_index(
            index_name="pseudonym_id-index",
            partition_key=dynamodb.Attribute(name="pseudonym_id", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )
        
        return table
    
    def _create_onboarding_table(self) -> dynamodb.Table:
        """Create DynamoDB table for onboarding data."""
        table = dynamodb.Table(
            self.scope, "OnboardingTable",
            partition_key=dynamodb.Attribute(name="pseudonym_id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
            removal_policy=RemovalPolicy.RETAIN,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=self.kms_key,
            
            # CRITICAL: Deletion protection
            deletion_protection=True,
        )
        
        table.add_global_secondary_index(
            index_name="StatusIndex",
            partition_key=dynamodb.Attribute(name="status", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="created_at", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )
        
        return table