resource "aws_iam_role" "marcos_role" {
  name = "${var.APP_ENV}_marcos_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })

  lifecycle {
    prevent_destroy = false
  }
}


# Policy for S3 Bucket access
resource "aws_iam_policy_attachment" "s3_full_access_attachment" {
  name       = "${var.APP_ENV}-s3-full-access-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"

  lifecycle {
    prevent_destroy = false
  }
}

# Similar resources for DynamoDB, Lambda, CloudWatch Logs, and API Gateway access policies...
resource "aws_iam_policy_attachment" "aws_api_push_logs_to_cloudwatch_attachment" {
  name       = "${var.APP_ENV}-push-api-logs-to-cloudwatch-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_iam_policy_attachment" "cloudwatch_logs_attachment" {
  name       = "${var.APP_ENV}-cloudwatch-logs-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"

  lifecycle {
    prevent_destroy = false
  }

}

# API Gateway access policy attachment
resource "aws_iam_policy_attachment" "api_gateway_attachment" {
  name       = "${var.APP_ENV}-api-gateway-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator"


  lifecycle {
    prevent_destroy = false
  }
}



# Attach Lambda full access policy to the role
resource "aws_iam_policy_attachment" "lambda_access_attachment" {
  name       = "${var.APP_ENV}-lambda-access-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSLambda_FullAccess"

  lifecycle {
    prevent_destroy = false
  }
}

# Attach API Gateway Administrator access policy to the role
resource "aws_iam_policy_attachment" "api_gateway_invoke_full_attachment" {
  name       = "${var.APP_ENV}-api-gateway-invoke-full-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonAPIGatewayInvokeFullAccess"

  lifecycle {
    prevent_destroy = false
  }
}

# DynamoDB full access policy (Example: providing full access to all resources)

resource "aws_iam_policy_attachment" "dynamodb_full_access_attachment" {
  name       = "${var.APP_ENV}-dynamodb-full-access-attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"

  lifecycle {
    prevent_destroy = false
  }
}


resource "aws_iam_policy" "events_policy" {
  name        = "EventBridge_Policy"
  description = "IAM policy for EventBridge"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = "events:PutRule",
      Resource = "arn:aws:events:us-east-1:314764559768:rule/every_hour_schedule",
    }],
  })
}

resource "aws_iam_policy_attachment" "events_policy_attachment" {
  name       = "events_policy_attachment"
  roles      = [aws_iam_role.marcos_role.name]
  policy_arn = aws_iam_policy.events_policy.arn
}



resource "aws_apigatewayv2_authorizer" "marcos_authorizer" {
  name = var.authorizer.NAME
  #api_id          = aws_api_gateway_rest_api.marcos_api.id
  api_id          = aws_apigatewayv2_api.marcos_api.id
  authorizer_type = "JWT"

  jwt_configuration {
    audience = [var.authorizer.AUDIENCE]
    issuer   = var.authorizer.ISSUER
  }

  identity_sources = [
    var.authorizer.IDENTITY_SOURCES
  ]

  lifecycle {
    prevent_destroy = false
  }
}


