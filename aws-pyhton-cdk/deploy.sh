#!/bin/bash

# Marcos MVP Deployment Script - Updated for Refactored Infrastructure
# This script deploys the Marcos MVP stack with comprehensive checks and error handling

set -euo pipefail

# Configuration
STACK="MarcosMvpStack"
ENVIRONMENT="${ENVIRONMENT:-Dev}"
NUMBER="${NUMBER:-2}"
STACK_NAME="MarcosMvpStack-${ENVIRONMENT}-${NUMBER}"
AWS_PROFILE="${AWS_PROFILE:-}"
AWS_REGION="${AWS_REGION:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions 
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${BLUE}🔨 $1${NC}"
}

# Error handling
cleanup() {
    log_warning "Cleaning up on exit..."
    if [ -n "${CDK_OUT_DIR:-}" ] && [ -d "$CDK_OUT_DIR" ]; then
        rm -rf "$CDK_OUT_DIR"
    fi
}

trap cleanup EXIT INT TERM

echo -e "${GREEN}🚀 Starting Marcos MVP Deployment (Refactored Infrastructure)...${NC}"
echo "=================================================="

# Show configuration
log_info "Configuration:"
echo "   Stack Name: $STACK_NAME"
echo "   Infrastructure: Service-based organization"
if [ -n "$AWS_PROFILE" ]; then
    echo "   AWS Profile: $AWS_PROFILE"
else
    echo "   AWS Profile: Default (no profile specified)"
fi
if [ -n "$AWS_REGION" ]; then
    echo "   AWS Region: $AWS_REGION"
else
    echo "   AWS Region: Will use configured default"
fi
echo ""

# Check if we're in the right directory
log_step "Checking directory structure..."
if [ ! -f "app.py" ]; then
    log_error "app.py not found. Please run this script from the cdk_app directory."
    exit 1
fi

if [ ! -d "lambda" ] || [ ! -d "layers" ] || [ ! -d "infrastructure" ]; then
    log_error "Required directories not found. Please ensure you're in the correct project structure."
    exit 1
fi

# Check refactored infrastructure files
log_step "Verifying refactored infrastructure files..."
infrastructure_files=(
    "infrastructure/__init__.py"
    "infrastructure/marcos_mvp_stack.py"
    "infrastructure/s3.py"
    "infrastructure/dynamodb.py"
    "infrastructure/lambda_functions.py"
    "infrastructure/cognito.py"
    "infrastructure/api_gateway.py"
    "infrastructure/cloudfront.py"
    "infrastructure/kms.py"
    "infrastructure/ssm.py"
    "infrastructure/cloudwatch.py"
)

for file in "${infrastructure_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Required infrastructure file not found: $file"
        exit 1
    fi
done

log_success "Refactored infrastructure files verified"

# Check Python version - more flexible approach
log_step "Checking Python version..."

# Try to find the best available Python version
PYTHON_CMD=""
if command -v python3.12 &> /dev/null; then
    PYTHON_CMD="python3.12"
    PYTHON_VERSION="3.12"
elif command -v python3.11 &> /dev/null; then
    PYTHON_CMD="python3.11"
    PYTHON_VERSION="3.11"
elif command -v python3.10 &> /dev/null; then
    PYTHON_CMD="python3.10"
    PYTHON_VERSION="3.10"
elif command -v python3.9 &> /dev/null; then
    PYTHON_CMD="python3.9"
    PYTHON_VERSION="3.9"
elif command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    # Get actual version
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
else
    log_error "No suitable Python version found. Please install Python 3.9 or higher."
    exit 1
fi

log_success "Using Python $PYTHON_VERSION ($PYTHON_CMD)"

# Check if virtual environment exists
log_step "Checking virtual environment..."
VENV_DIR="cdk_venv_${PYTHON_VERSION//./}"
if [ ! -d "$VENV_DIR" ]; then
    log_warning "Python $PYTHON_VERSION virtual environment not found. Creating new one..."
    $PYTHON_CMD -m venv $VENV_DIR
    log_success "Virtual environment created"
fi

# Activate virtual environment
log_step "Activating Python $PYTHON_VERSION virtual environment..."
source $VENV_DIR/bin/activate

# Verify Python version in virtual environment
ACTUAL_PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
log_success "Python $ACTUAL_PYTHON_VERSION virtual environment activated"

# Check and install CDK dependencies
log_step "Checking CDK dependencies..."
if ! python -c "import aws_cdk" &> /dev/null; then
    log_warning "CDK dependencies not found. Installing..."
    pip install -r requirements.txt
    log_success "CDK dependencies installed"
fi

# Check if CDK is installed
log_step "Checking CDK CLI..."
if ! command -v cdk &> /dev/null; then
    log_warning "CDK CLI not found. Installing..."
    npm install -g aws-cdk
    log_success "CDK CLI installed"
fi

# Check AWS credentials
log_step "Checking AWS credentials..."
if [ -n "$AWS_PROFILE" ]; then
    if ! aws sts get-caller-identity --profile "$AWS_PROFILE" &> /dev/null; then
        log_error "AWS credentials not valid for profile: $AWS_PROFILE"
        exit 1
    fi
    AWS_ACCOUNT=$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)
    log_success "AWS credentials valid for profile: $AWS_PROFILE (Account: $AWS_ACCOUNT)"
else
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure' or set AWS_PROFILE"
        exit 1
    fi
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    log_success "AWS credentials valid (Account: $AWS_ACCOUNT)"
fi

# Check AWS region
log_step "Checking AWS region..."
if [ -n "$AWS_REGION" ]; then
    log_success "Using AWS region from environment: $AWS_REGION"
elif [ -n "$AWS_PROFILE" ]; then
    AWS_REGION=$(aws configure get region --profile "$AWS_PROFILE" 2>/dev/null || echo "")
    if [ -n "$AWS_REGION" ]; then
        log_success "Using AWS region from profile: $AWS_REGION"
    else
        log_warning "AWS region not configured for profile: $AWS_PROFILE"
        log_info "Please set AWS_REGION environment variable or configure region manually"
        exit 1
    fi
else
    # Check default region
    if ! aws configure get region &> /dev/null; then
        log_warning "AWS region not configured for default profile"
        log_info "Please set AWS_REGION environment variable or configure region manually"
        exit 1
    fi
    AWS_REGION=$(aws configure get region)
    log_success "Using AWS region from default profile: $AWS_REGION"
fi

# Bootstrap CDK if needed
log_step "Checking CDK bootstrap status..."
BOOTSTRAP_STACK_NAME="CDKToolkit"
if [ -n "$AWS_PROFILE" ]; then
    BOOTSTRAP_STATUS=$(aws cloudformation describe-stacks --stack-name "$BOOTSTRAP_STACK_NAME" --profile "$AWS_PROFILE" 2>/dev/null || echo "NOT_FOUND")
else
    BOOTSTRAP_STATUS=$(aws cloudformation describe-stacks --stack-name "$BOOTSTRAP_STACK_NAME" 2>/dev/null || echo "NOT_FOUND")
fi

if [[ "$BOOTSTRAP_STATUS" == *"NOT_FOUND"* ]]; then
    log_warning "CDK bootstrap stack not found. Bootstrapping environment..."
    if [ -n "$AWS_PROFILE" ]; then
        if ! cdk bootstrap --profile "$AWS_PROFILE" --quiet; then
            log_error "CDK bootstrap failed. Please check the errors above."
            exit 1
        fi
    else
        if ! cdk bootstrap --quiet; then
            log_error "CDK bootstrap failed. Please check the errors above."
            exit 1
        fi
    fi
    log_success "CDK bootstrap completed"
else
    log_success "CDK bootstrap stack already exists, skipping bootstrap"
fi
# Verify Terra layer exists
log_step "Checking Terra layer..."
if [ ! -f "layers/terra/terra_layer.zip" ]; then
    log_warning "Terra layer not found. Building it now..."
    cd layers/terra
    if [ -f "build_layer.sh" ]; then
        chmod +x build_layer.sh
        ./build_layer.sh
        cd ../..
    else
        log_error "Terra layer build script not found. Please build the layer manually."
        exit 1
    fi
fi

log_success "Terra layer verified"

# Clean up any previous synthesis artifacts
log_step "Cleaning up previous synthesis artifacts..."
rm -rf cdk.out
log_success "Cleanup completed"

# Validate refactored infrastructure syntax
log_step "Validating refactored infrastructure syntax..."
if ! python -c "from infrastructure import MarcosMvpSecureStack; print('Infrastructure import successful')" 2>/dev/null; then
    log_error "Infrastructure syntax validation failed. Please check your refactored files."
    exit 1
fi
log_success "Infrastructure syntax validation passed"

# Synthesize the stack
log_step "Synthesizing Marcos MVP stack..."
if [ -n "$AWS_PROFILE" ]; then
    if ! cdk synth --app "python3 app.py" --profile "$AWS_PROFILE" --quiet; then
        log_error "Stack synthesis failed. Please check the errors above."
        exit 1
    fi
else
    if ! cdk synth --app "python3 app.py" --quiet; then
        log_error "Stack synthesis failed. Please check the errors above."
        exit 1
    fi
fi

log_success "Stack synthesis completed"

# Get the actual stack name from CDK
log_step "Getting actual stack name..."
if [ -n "$AWS_PROFILE" ]; then
    ACTUAL_STACK_NAME=$(cdk list --app "python3 app.py" --profile "$AWS_PROFILE" 2>/dev/null | tail -n 1 | tr -d '\n')
else
    ACTUAL_STACK_NAME=$(cdk list --app "python3 app.py" 2>/dev/null | tail -n 1 | tr -d '\n')
fi

if [ -z "$ACTUAL_STACK_NAME" ]; then
    log_error "Could not determine stack name from CDK"
    exit 1
fi

log_success "Using stack name: $ACTUAL_STACK_NAME"

# Show deployment plan
log_step "Showing deployment plan..."
if [ -n "$AWS_PROFILE" ]; then
    cdk diff --app "python3 app.py" --profile "$AWS_PROFILE" || true
else
    cdk diff --app "python3 app.py" || true
fi

# Confirm deployment
echo ""
read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Deployment cancelled by user"
    exit 0
fi

# Deploy the stack
log_step "Deploying Marcos MVP stack..."
if [ -n "$AWS_PROFILE" ]; then
    if cdk deploy "$ACTUAL_STACK_NAME" --app "python3 app.py" --profile "$AWS_PROFILE" --require-approval never; then
        log_success "Marcos MVP deployment completed successfully!"
    else
        log_error "Deployment failed. Please check the errors above."
        exit 1
    fi
else
    if cdk deploy "$ACTUAL_STACK_NAME" --app "python3 app.py" --require-approval never; then
        log_success "Marcos MVP deployment completed successfully!"
    else
        log_error "Deployment failed. Please check the errors above."
        exit 1
    fi
fi

# Get stack outputs
log_step "Retrieving stack outputs..."
if [ -n "$AWS_PROFILE" ]; then
    cdk_outputs=$(cdk list-exports --app "python3 app.py" --profile "$AWS_PROFILE" 2>/dev/null || echo "No exports found")
else
    cdk_outputs=$(cdk list-exports --app "python3 app.py" 2>/dev/null || echo "No exports found")
fi

echo ""
echo "=================================================="
log_success "🎉 Marcos MVP deployment completed successfully!"
echo ""
echo "📁 Infrastructure Organization:"
echo "   ✅ Service-based file structure deployed"
echo "   ✅ S3 buckets: infrastructure/s3.py"
echo "   ✅ DynamoDB tables: infrastructure/dynamodb.py" 
echo "   ✅ Lambda functions: infrastructure/lambda_functions.py"
echo "   ✅ Cognito auth: infrastructure/cognito.py"
echo "   ✅ API Gateway: infrastructure/api_gateway.py"
echo "   ✅ CloudFront: infrastructure/cloudfront.py"
echo "   ✅ Monitoring: infrastructure/cloudwatch.py"
echo ""
echo "📋 Next steps:"
echo "1. Test the API endpoints"
echo "2. Verify Lambda functions are working"
echo "3. Check the React UI deployment"
echo "4. Update SSM parameters with your actual Terra credentials"
echo ""
echo "🔗 Stack details:"
echo "   Name: $ACTUAL_STACK_NAME"
echo "   Region: $AWS_REGION"
echo "   Account: $AWS_ACCOUNT"
echo ""
echo "🔧 To update SSM parameters:"
if [ -n "$AWS_PROFILE" ]; then
    echo "   aws ssm put-parameter --name '/$STACK/TERRA_DEV_ID' --value 'your_dev_id' --type 'SecureString' --profile $AWS_PROFILE"
    echo "   aws ssm put-parameter --name '/$STACK/TERRA_API_KEY' --value 'your_api_key' --type 'SecureString' --profile $AWS_PROFILE"
else
    echo "   aws ssm put-parameter --name '/$STACK/TERRA_DEV_ID' --value 'your_dev_id' --type 'SecureString'"
    echo "   aws ssm put-parameter --name '/$STACK/TERRA_API_KEY' --value 'your_api_key' --type 'SecureString'"
fi
echo ""
echo "🧪 To test the deployment:"
if [ -n "$AWS_PROFILE" ]; then
    echo "   aws lambda invoke --function-name $ACTUAL_STACK_NAME-IngestLambda --payload '{}' --profile $AWS_PROFILE response.json"
else
    echo "   aws lambda invoke --function-name $ACTUAL_STACK_NAME-IngestLambda --payload '{}' response.json"
fi
echo ""
echo "📊 To monitor the stack:"
if [ -n "$AWS_PROFILE" ]; then
    echo "   aws cloudformation describe-stacks --stack-name $ACTUAL_STACK_NAME --profile $AWS_PROFILE"
else
    echo "   aws cloudformation describe-stacks --stack-name $ACTUAL_STACK_NAME"
fi
echo ""
echo "🌐 To generate .env file for UI:"
echo "   cd ui && python3 generate_env.py $ACTUAL_STACK_NAME $AWS_REGION $AWS_PROFILE"
