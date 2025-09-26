"""
Simple configuration constants for Marcos MVP
Environment-aware configuration management
"""
import os

# Environment Configuration
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'dev')  # dev, staging, prod
STACK = "MarcosMvp"
NUMBER = os.environ.get("NUMBER", "2")
STACK_NAME = f"MarcosMvpStack-{ENVIRONMENT.capitalize()}-{NUMBER}"


# API Key (environment-specific)
API_KEYS = {
    'dev': "dev-marcos-mvp-key-2024-development-32chars",
    'staging': "staging-marcos-mvp-key-2024-testing-32chars", 
    'prod': "prod-marcos-mvp-key-2024-secure-production"
}
API_KEY = API_KEYS.get(ENVIRONMENT, API_KEYS['dev'])

# CORS Origins (environment-specific)
ORIGINS_CONFIG = {
    'dev': [
        "http://localhost:3000",
    ],
    'staging': [
        "http://localhost:3000",
    ],
    'prod': [
        "http://localhost:3000",
    ]
}
ORIGINS = ORIGINS_CONFIG.get(ENVIRONMENT, ORIGINS_CONFIG['dev'])

# CORS Methods (same for all environments)
METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]

# CORS Headers (same for all environments)
HEADERS = [
    "Content-Type",
    "Authorization", 
    "X-Amz-Date",
    "X-Api-Key",
    "X-Amz-Security-Token",
    "X-Requested-With",
    "Accept",
    "Origin"
]

# Stage Name
STAGE = ENVIRONMENT

# Cognito Callback URLs (environment-specific)
CALLBACK_URLS = {
    'dev': [
        "http://localhost:3000",
    ],
    'staging': [
        "http://localhost:3000",
    ],
    'prod': [
        "http://localhost:3000",
    ]
}

# Cognito Logout URLs (environment-specific)
LOGOUT_URLS = {
    'dev': [
        "http://localhost:3000",
    ],
    'staging': [
        "http://localhost:3000",
    ],
    'prod': [
        "http://localhost:3000",
    ]
}

# Terra Configuration
TERRA_CONFIG = {
    'dev': {
        'dev_id': 'marcos-dev',
        'api_key': 'dev-terra-api-key-32chars',
        'webhook_secret': 'dev-webhook-secret-32chars'
    },
    'staging': {
        'dev_id': 'marcos-staging',
        'api_key': 'staging-terra-api-key-32chars',
        'webhook_secret': 'staging-webhook-secret-32chars'
    },
    'prod': {
        'dev_id': 'marcos-prod',
        'api_key': 'prod-terra-api-key-32chars',
        'webhook_secret': 'prod-webhook-secret-32chars'
    }
}

# Get current environment config
CURRENT_TERRA_CONFIG = TERRA_CONFIG.get(ENVIRONMENT, TERRA_CONFIG['dev'])
TERRA_DEV_ID = CURRENT_TERRA_CONFIG['dev_id']
TERRA_API_KEY = CURRENT_TERRA_CONFIG['api_key']
TERRA_WEBHOOK_SECRET = CURRENT_TERRA_CONFIG['webhook_secret']

# DynamoDB Table Names
TABLE_NAMES = {
    'dev': {
        'raw_data': 'marcos-mvp-dev-raw-data',
        'summary': 'marcos-mvp-dev-summary'
    },
    'staging': {
        'raw_data': 'marcos-mvp-staging-raw-data',
        'summary': 'marcos-mvp-staging-summary'
    },
    'prod': {
        'raw_data': 'marcos-mvp-prod-raw-data',
        'summary': 'marcos-mvp-prod-summary'
    }
}

CURRENT_TABLE_NAMES = TABLE_NAMES.get(ENVIRONMENT, TABLE_NAMES['dev'])
RAW_DATA_TABLE = CURRENT_TABLE_NAMES['raw_data']
SUMMARY_TABLE = CURRENT_TABLE_NAMES['summary']

# User Pool Callback URLs (for Cognito)
USER_POOL_CALL_BACK_URLS = CALLBACK_URLS.get(ENVIRONMENT, CALLBACK_URLS['dev'])

# User Pool Logout URLs (for Cognito)  
USER_POOL_LOGOUT_URLS = LOGOUT_URLS.get(ENVIRONMENT, LOGOUT_URLS['dev'])
