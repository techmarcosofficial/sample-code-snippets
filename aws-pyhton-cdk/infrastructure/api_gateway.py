from aws_cdk import (
    aws_apigateway as apigw,
    aws_logs as logs,
    aws_iam as iam,
    Duration
)
from constructs import Construct
import time
import config


class ApiGateway:
    """Manages API Gateway resources with enhanced security."""
    
    def __init__(self, scope: Construct, stack_name: str, account: str, lambda_functions, cognito_auth):
        self.scope = scope
        self.stack_name = stack_name
        self.account = account
        self.lambda_functions = lambda_functions
        self.cognito_auth = cognito_auth
        
        self.api_gateway = self._create_api_gateway()
        self.api_key = self._create_api_key()
        self.usage_plan = self._create_usage_plan()
    
    def _create_api_gateway(self) -> apigw.RestApi:
        """Create API Gateway with enhanced security and monitoring."""
        api = apigw.RestApi(
            self.scope, f"{config.STACK}Api",
            rest_api_name=f"{self.stack_name}-API",
            description="Marcos MVP API with Terra integration and enhanced security",
            default_cors_preflight_options=apigw.CorsOptions(
                allow_origins=config.ORIGINS,
                allow_methods=config.METHODS,
                allow_headers=config.HEADERS,
                allow_credentials=True,
                max_age=Duration.seconds(86400),
                expose_headers=["X-Total-Count", "X-Page-Count"]
            ),
            deploy_options=apigw.StageOptions(
                stage_name=config.STAGE,
                logging_level=apigw.MethodLoggingLevel.INFO,
                data_trace_enabled=True,
                metrics_enabled=True,
                tracing_enabled=True,
                # Enhanced Rate Limiting
                throttling_rate_limit=1000,
                throttling_burst_limit=2000,
                access_log_destination=apigw.LogGroupLogDestination(
                    logs.LogGroup(
                        self.scope, "ApiGatewayAccessLogs",
                        log_group_name=f"/aws/apigateway/{self.stack_name}-{self.account}-{int(time.time())}/access-logs",
                        retention=logs.RetentionDays.ONE_MONTH
                    )
                ),
                access_log_format=apigw.AccessLogFormat.json_with_standard_fields(
                    caller=True, http_method=True, ip=True, protocol=True,
                    request_time=True, resource_path=True, response_length=True,
                    status=True, user=True
                )
            ),
            api_key_source_type=apigw.ApiKeySourceType.HEADER
        )

        # Create authorizer
        authorizer = apigw.CognitoUserPoolsAuthorizer(
            self.scope, "Authorizer", 
            cognito_user_pools=[self.cognito_auth.user_pool],
            identity_source="method.request.header.Authorization",
            results_cache_ttl=Duration.minutes(2)
        )

        # Create request validator
        # self.request_validator = apigw.RequestValidator(
        #     self.scope, "RequestValidator",
        #     rest_api=api,
        #     validate_request_body=True,
        #     validate_request_parameters=True
        # )

        self._create_api_endpoints(api, authorizer)
        return api
    
    def _create_api_key(self) -> apigw.ApiKey:
        """Create API Key for webhook and public endpoints."""
        return apigw.ApiKey(
            self.scope, f"{config.STACK}ApiKey",
            api_key_name=f"{self.stack_name}-api-key",
            description="API Key for Marcos MVP webhook and public endpoints",
            value=config.API_KEY
        )
    
    def _create_usage_plan(self) -> apigw.UsagePlan:
        """Create usage plan with rate limiting and quotas."""
        usage_plan = apigw.UsagePlan(
            self.scope, f"{config.STACK}UsagePlan",
            name=f"{self.stack_name}-usage-plan",
            description="Usage plan for Marcos MVP API with rate limiting",
            throttle=apigw.ThrottleSettings(
                rate_limit=100,
                burst_limit=200
            ),
            quota=apigw.QuotaSettings(
                limit=100000,
                period=apigw.Period.DAY
            )
        )
        
        # Associate API key with usage plan
        usage_plan.add_api_key(self.api_key)
        
        # Associate API stage with usage plan
        usage_plan.add_api_stage(
            api=self.api_gateway,
            stage=self.api_gateway.deployment_stage
        )
        
        return usage_plan
    
    def _create_api_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create all API endpoints with enhanced security."""
        # Secured webhook endpoint with API key requirement
        webhook = api.root.add_resource("webhook")
        webhook.add_method(
            "POST", 
            apigw.LambdaIntegration(
                self.lambda_functions.ingest_function,
                timeout=Duration.seconds(25),
                integration_responses=[
                    apigw.IntegrationResponse(
                        status_code="200",
                        response_parameters={"method.response.header.Access-Control-Allow-Origin": "'*'"}
                    ),
                    apigw.IntegrationResponse(
                        status_code="429",
                        selection_pattern=".*Too Many Requests.*",
                        response_parameters={"method.response.header.Access-Control-Allow-Origin": "'*'"}
                    )
                ]
            ),
            method_responses=[
                apigw.MethodResponse(
                    status_code="200",
                    response_parameters={"method.response.header.Access-Control-Allow-Origin": True}
                ),
                apigw.MethodResponse(
                    status_code="429",
                    response_parameters={"method.response.header.Access-Control-Acllow-Origin": True}
                )
            ],
            api_key_required=True,
        )

        # Protected endpoints
        self._create_onboarding_endpoints(api, authorizer)
        self._create_terra_endpoints(api, authorizer)
        self._create_metrics_endpoints(api, authorizer)
        self._create_profile_endpoints(api, authorizer)
        self._create_auth_endpoints(api, authorizer)
        self._create_test_endpoints(api, authorizer)
    
    def _create_onboarding_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create onboarding endpoints."""
        onboarding = api.root.add_resource("onboarding")
        onboarding.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            
        )
    
    def _create_terra_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create Terra operation endpoints with enhanced security."""
        terra_ops = api.root.add_resource(
            "terra-ops",
            default_cors_preflight_options=apigw.CorsOptions(
                allow_origins=config.ORIGINS,
                allow_methods=["OPTIONS", "POST", "GET"],
                allow_headers=config.HEADERS
            )
        )

        # POST endpoint
        terra_ops.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            authorizer=authorizer,
            authorization_type=apigw.AuthorizationType.COGNITO,
            # authorization_scopes=["marcos-api/admin", "marcos-api/dev"],
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429"),
                apigw.MethodResponse(status_code="403")
            ]
        )

        # GET endpoint
        terra_ops.add_method(
            "GET",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            authorizer=authorizer,
            authorization_type=apigw.AuthorizationType.COGNITO,
            # authorization_scopes=["marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            
        )
    
    def _create_metrics_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create metrics and data endpoints with rate limiting."""
        # Metrics endpoint
        metrics = api.root.add_resource("metrics")
        metrics.add_method(
            "GET",
            apigw.LambdaIntegration(
                self.lambda_functions.query_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429")
            ]
        )

        # Data deletion endpoint with strict rate limiting
        delete_data = api.root.add_resource("delete_data")
        delete_data.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.query_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/admin", "marcos-api/dev"],
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429"),
                apigw.MethodResponse(status_code="403")
            ]
        )
    
    def _create_profile_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create user profile endpoints with rate limiting."""
        profile = api.root.add_resource("profile")
        
        # GET profile
        profile.add_method(
            "GET",
            apigw.LambdaIntegration(
                self.lambda_functions.query_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            
        )
        
        # PUT profile
        profile.add_method(
            "PUT",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429")
            ]
        )
    
    def _create_auth_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create authentication-related endpoints with rate limiting."""
        # Auth status endpoint
        auth_status = api.root.add_resource("auth-status")
        auth_status.add_method(
            "GET",
            apigw.LambdaIntegration(
                self.lambda_functions.query_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/marcos_professional", "marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            
        )
        
        # Password change endpoint
        change_password = api.root.add_resource("change-password")
        change_password.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429")
            ]
        )
        
        # Public endpoints with API key requirement
        forgot_password = api.root.add_resource("forgot-password")
        forgot_password.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            api_key_required=True,
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429"),
                apigw.MethodResponse(status_code="403")
            ]
        )
        
        # Confirm forgot password endpoint with API key
        confirm_forgot_password = api.root.add_resource("confirm-forgot-password")
        confirm_forgot_password.add_method(
            "POST",
            apigw.LambdaIntegration(
                self.lambda_functions.onboarding_function, 
                timeout=Duration.seconds(25)
            ),
            api_key_required=True,
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429"),
                apigw.MethodResponse(status_code="403")
            ]
        )
    
    def _create_test_endpoints(self, api: apigw.RestApi, authorizer: apigw.CognitoUserPoolsAuthorizer):
        """Create test endpoints with rate limiting."""
        test_public = api.root.add_resource("test-api")
        test_public.add_method(
            "GET",
            apigw.LambdaIntegration(
                self.lambda_functions.test_public_function, 
                timeout=Duration.seconds(25)
            ),
            authorization_type=apigw.AuthorizationType.COGNITO,
            authorizer=authorizer,
            # authorization_scopes=["marcos-api/marcos_professional", "marcos-api/standard_user", "marcos-api/admin", "marcos-api/dev"],
            method_responses=[
                apigw.MethodResponse(status_code="200"),
                apigw.MethodResponse(status_code="429")
            ]
        )

    def get_api_key_id(self) -> str:
        """Return the API key ID for reference."""
        return self.api_key.key_id
    
    def get_api_key_value(self) -> str:
        """Return the API key value (use with caution)."""
        return self.api_key.key_arn