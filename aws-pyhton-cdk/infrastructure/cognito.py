from aws_cdk import (
    aws_cognito as cognito,
    Duration
)
from constructs import Construct
import config

class CognitoAuth:
    """Manages Cognito authentication resources."""
    
    def __init__(self, scope: Construct, stack_name: str, lambda_functions=None):
        self.scope = scope
        self.stack_name = stack_name
        self.lambda_functions = lambda_functions
        
        self.user_pool, self.user_pool_client = self._create_cognito_auth()
        self.admin_group, self.user_group, self.marcos_professional_group = self._create_user_groups()
    
    def _create_cognito_auth(self):
        """Create Cognito User Pool and Client."""
        
        # Build lambda triggers configuration
        lambda_triggers = {}
        if self.lambda_functions:
            lambda_triggers = {
                "post_confirmation": self.lambda_functions.post_confirmation_trigger,
                "pre_token_generation": self.lambda_functions.pre_token_generation_trigger
            }
        
        user_pool = cognito.UserPool(
            self.scope, f"{config.STACK}UserPool",
            user_pool_name=f"{self.stack_name}-UserPool",
            self_sign_up_enabled=True,
            sign_in_aliases=cognito.SignInAliases(
                email=True,
                username=False
            ),
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(required=True, mutable=True),
                given_name=cognito.StandardAttribute(required=False, mutable=True),
                family_name=cognito.StandardAttribute(required=False, mutable=True),
                phone_number=cognito.StandardAttribute(required=False, mutable=True)
            ),
            custom_attributes={
                "user_type": cognito.StringAttribute(min_len=1, max_len=50, mutable=True),
                "preferred_language": cognito.StringAttribute(min_len=2, max_len=10, mutable=True),
                "timezone": cognito.StringAttribute(min_len=1, max_len=50, mutable=True),
                "scopes": cognito.StringAttribute(min_len=1, max_len=200, mutable=True)
            },
            password_policy=cognito.PasswordPolicy(
                min_length=8,
                require_lowercase=True,
                require_uppercase=True,
                require_digits=True,
                require_symbols=True,
                temp_password_validity=Duration.days(7)
            ),
            account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
            user_verification=cognito.UserVerificationConfig(
                email_subject=f"Verify your email for {config.STACK}",
                email_body="Thanks for signing up! Your verification code is {####}",
                email_style=cognito.VerificationEmailStyle.CODE
            ),
            mfa=cognito.Mfa.OPTIONAL,
            mfa_second_factor=cognito.MfaSecondFactor(sms=True, otp=True),
            # Add Lambda triggers here
            lambda_triggers=cognito.UserPoolTriggers(
                post_confirmation=lambda_triggers.get("post_confirmation"),
                pre_token_generation=lambda_triggers.get("pre_token_generation")
            ) if lambda_triggers else None
        )

        # Create resource server and scopes
        # dev_scope = cognito.ResourceServerScope(scope_name="dev", scope_description="Developer/internal team")
        # admin_scope = cognito.ResourceServerScope(scope_name="admin", scope_description="Data steward with full control")
        # standard_user_scope = cognito.ResourceServerScope(scope_name="standard_user", scope_description="B2C end user")
        # marcos_professional_scope = cognito.ResourceServerScope(scope_name="marcos_professional", scope_description="Coach/Doctor view")
        
        # marcos_api_rs = cognito.UserPoolResourceServer(
        #     self.scope, "MarcosApiResourceServer",
        #     user_pool=user_pool,
        #     identifier="marcos-api",
        #     scopes=[dev_scope, admin_scope, standard_user_scope, marcos_professional_scope],
        # )

        # Create user pool client
        user_pool_client = cognito.UserPoolClient(
            self.scope, f"{config.STACK}UserPoolClient",
            user_pool=user_pool,
            user_pool_client_name=f"{self.stack_name}-Client",
            generate_secret=False,
            supported_identity_providers=[cognito.UserPoolClientIdentityProvider.COGNITO],
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(
                    authorization_code_grant=True,
                    implicit_code_grant=True,
                    client_credentials=False
                ),
                scopes=[
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.PROFILE,
                    # cognito.OAuthScope.resource_server(marcos_api_rs, dev_scope),
                    # cognito.OAuthScope.resource_server(marcos_api_rs, admin_scope),
                    # cognito.OAuthScope.resource_server(marcos_api_rs, standard_user_scope),
                    # cognito.OAuthScope.resource_server(marcos_api_rs, marcos_professional_scope)
                ],
                callback_urls=config.USER_POOL_CALL_BACK_URLS,
                logout_urls=config.USER_POOL_LOGOUT_URLS
            ),
            auth_flows=cognito.AuthFlow(
                admin_user_password=True,
                user_password=True,
                user_srp=True,
                custom=True
            ),
            access_token_validity=Duration.hours(1),
            id_token_validity=Duration.hours(1),
            refresh_token_validity=Duration.days(30),
            prevent_user_existence_errors=True,
            enable_token_revocation=True
        )
        
        return user_pool, user_pool_client
    
    def _create_user_groups(self):
        """Create Cognito user groups."""
        admin_group = cognito.CfnUserPoolGroup(
            self.scope, "AdminGroup",
            user_pool_id=self.user_pool.user_pool_id,
            group_name="admins",
            description="Administrator users with full access",
            precedence=1
        )
        
        user_group = cognito.CfnUserPoolGroup(
            self.scope, "UserGroup",
            user_pool_id=self.user_pool.user_pool_id,
            group_name="users",
            description="Regular users with standard access",
            precedence=10
        )
        
        marcos_professional_group = cognito.CfnUserPoolGroup(
            self.scope, "MarcosProfessionalGroup",
            user_pool_id=self.user_pool.user_pool_id,
            group_name="marcos-professionals",
            description="Marcos professionals with extended access",
            precedence=5
        )
        
        return admin_group, user_group, marcos_professional_group