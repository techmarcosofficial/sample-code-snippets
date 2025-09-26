resource "aws_cloudwatch_log_group" "cloudwatch_materials_logs" {
  name = "/aws/lambda/${var.APP_ENV}-materials"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_upload_files_logs" {
  name = "/aws/lambda/${var.APP_ENV}-upload-files"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_download_file_logs" {
  name = "/aws/lambda/${var.APP_ENV}-download-file"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_delete_files_logs" {
  name = "/aws/lambda/${var.APP_ENV}-delete-files"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_simulations_logs" {
  name = "/aws/lambda/${var.APP_ENV}-simulations"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_equipments_logs" {
  name = "/aws/lambda/${var.APP_ENV}-equipments"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_users_logs" {
  name = "/aws/lambda/${var.APP_ENV}-users"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_test_logs" {
  name = "/aws/lambda/${var.APP_ENV}-test"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_logs_logs" {
  name = "/aws/lambda/${var.APP_ENV}-logs"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_aws_q_logs" {
  name = "/aws/lambda/${var.APP_ENV}-aws-q"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_crystallization_logs" {
  name = "/aws/lambda/${var.APP_ENV}-crystallization-model"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_crystallization_tool_logs" {
  name = "/aws/lambda/${var.APP_ENV}-crystallization-tool"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_material_chains_logs" {
  name = "/aws/lambda/${var.APP_ENV}-material-chains"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_cloudwatch_log_group" "cloudwatch_cmac_model_logs" {
  name = "/aws/lambda/${var.APP_ENV}-cmac-model"

  tags = {
    Environment = "development"
    Application = "serviceA"
  }

  lifecycle {
    prevent_destroy = false
  }
}
