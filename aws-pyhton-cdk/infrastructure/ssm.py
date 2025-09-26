from aws_cdk import aws_ssm as ssm
from constructs import Construct
import os
import secrets
import config


class SSMParameters:
    """Manages SSM Parameter Store resources."""
    
    def __init__(self, scope: Construct):
        self.scope = scope
        self._create_ssm_parameters()
    
    def _create_ssm_parameters(self):
        """Create SSM parameters for configuration."""
        ssm.StringParameter(
            self.scope, "TerraDevId",
            parameter_name=f"/{config.STACK}/TERRA_DEV_ID",
            string_value=os.environ.get('TERRA_DEV_ID', 'changeme'),
        )
        
        ssm.StringParameter(
            self.scope, "TerraApiKey",
            parameter_name=f"/{config.STACK}/TERRA_API_KEY",
            string_value=os.environ.get('TERRA_API_KEY', 'changeme'),
        )

        ssm.StringParameter(
            self.scope, "WebhookSecret",
            parameter_name=f"/{config.STACK}/WEBHOOK_SECRET",            
            string_value=os.environ.get('WEBHOOK_SECRET', 'changeme'),
            # string_value=secrets.token_hex(20),
        )

        ssm.StringParameter(
            self.scope, "HashSalt",
            parameter_name=f"/{config.STACK}/HASH_SALT",
            string_value=secrets.token_hex(16),
        )