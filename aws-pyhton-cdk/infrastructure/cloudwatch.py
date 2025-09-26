from aws_cdk import (
    aws_cloudwatch as cloudwatch,
    Duration
)
from constructs import Construct


class CloudWatchMonitoring:
    """Manages CloudWatch monitoring and alerting."""
    
    def __init__(self, scope: Construct, stack_name: str, lambda_functions, 
                 api_gateway, summary_table, master_key, distribution_id: str):
        self.scope = scope
        self.stack_name = stack_name
        self.lambda_functions = lambda_functions
        self.api_gateway = api_gateway
        self.summary_table = summary_table
        self.master_key = master_key
        self.distribution_id = distribution_id
        
        self._create_cloudwatch_alarms()
    
    def _create_cloudwatch_alarms(self):
        """Create CloudWatch alarms for comprehensive monitoring."""
        # Lambda function monitoring
        cloudwatch.Alarm(
            self.scope, "LambdaErrorRateAlarm",
            metric=self.lambda_functions.ingest_function.metric_errors(
                period=Duration.minutes(5), 
                statistic="Sum"
            ),
            threshold=1,
            evaluation_periods=2,
            alarm_description="Alert when Lambda functions encounter errors",
            alarm_name=f"{self.stack_name}-Lambda-Error-Rate",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING,
            actions_enabled=True
        )
        
        cloudwatch.Alarm(
            self.scope, "LambdaDurationAlarm",
            metric=self.lambda_functions.ingest_function.metric_duration(
                period=Duration.minutes(5), 
                statistic="Average"
            ),
            threshold=25000,
            evaluation_periods=2,
            alarm_description="Alert when Lambda functions take too long to execute",
            alarm_name=f"{self.stack_name}-Lambda-Duration",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # API Gateway monitoring
        cloudwatch.Alarm(
            self.scope, "ApiGateway4XXAlarm",
            metric=cloudwatch.Metric(
                namespace="AWS/ApiGateway",
                metric_name="4XXError",
                dimensions_map={"ApiName": self.api_gateway.rest_api_name},
                period=Duration.minutes(5),
                statistic="Sum"
            ),
            threshold=10,
            evaluation_periods=2,
            alarm_description="Alert when API Gateway returns 4XX errors",
            alarm_name=f"{self.stack_name}-API-4XX-Errors",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        cloudwatch.Alarm(
            self.scope, "ApiGateway5XXAlarm",
            metric=cloudwatch.Metric(
                namespace="AWS/ApiGateway",
                metric_name="5XXError",
                dimensions_map={"ApiName": self.api_gateway.rest_api_name},
                period=Duration.minutes(5),
                statistic="Sum"
            ),
            threshold=5,
            evaluation_periods=2,
            alarm_description="Alert when API Gateway returns 5XX errors",
            alarm_name=f"{self.stack_name}-API-5XX-Errors",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # API Gateway latency monitoring
        cloudwatch.Alarm(
            self.scope, "ApiGatewayLatencyAlarm",
            metric=cloudwatch.Metric(
                namespace="AWS/ApiGateway",
                metric_name="Latency",
                dimensions_map={"ApiName": self.api_gateway.rest_api_name},
                period=Duration.minutes(5),
                statistic="Average"
            ),
            threshold=1000,
            evaluation_periods=2,
            alarm_description="Alert when API Gateway latency is too high",
            alarm_name=f"{self.stack_name}-API-Latency",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # DynamoDB monitoring
        cloudwatch.Alarm(
            self.scope, "DynamoDBThrottledAlarm",
            metric=self.summary_table.metric_throttled_requests_for_operation(
                operation="GetItem",
                period=Duration.minutes(5),
                statistic="Sum"
            ),
            threshold=10,
            evaluation_periods=2,
            alarm_description="Alert when DynamoDB requests are throttled",
            alarm_name=f"{self.stack_name}-DynamoDB-Throttled",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # DynamoDB consumed capacity monitoring
        cloudwatch.Alarm(
            self.scope, "DynamoDBConsumedCapacityAlarm",
            metric=self.summary_table.metric_consumed_read_capacity_units(
                period=Duration.minutes(5),
                statistic="Sum"
            ),
            threshold=1000,
            evaluation_periods=2,
            alarm_description="Monitor DynamoDB read capacity consumption",
            alarm_name=f"{self.stack_name}-DynamoDB-Read-Capacity",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # CloudFront monitoring
        cloudwatch.Alarm(
            self.scope, "CloudFrontErrorRateAlarm",
            metric=cloudwatch.Metric(
                namespace="AWS/CloudFront",
                metric_name="5xxErrorRate",
                dimensions_map={"DistributionId": self.distribution_id, "Region": "Global"},
                period=Duration.minutes(5),
                statistic="Average"
            ),
            threshold=5.0,
            evaluation_periods=2,
            alarm_description="Alert when CloudFront returns 5XX errors",
            alarm_name=f"{self.stack_name}-CloudFront-5XX-Errors",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )
        
        # KMS key usage monitoring
        cloudwatch.Alarm(
            self.scope, "KMSKeyUsageAlarm",
            metric=cloudwatch.Metric(
                namespace="AWS/KMS",
                metric_name="KeyUsage",
                dimensions_map={"KeyId": self.master_key.key_id},
                period=Duration.minutes(5),
                statistic="Sum"
            ),
            threshold=100,
            evaluation_periods=2,
            alarm_description="Monitor KMS key usage patterns",
            alarm_name=f"{self.stack_name}-KMS-Key-Usage",
            treat_missing_data=cloudwatch.TreatMissingData.NOT_BREACHING
        )