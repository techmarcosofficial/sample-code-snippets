//IaC Tables
resource "aws_dynamodb_table" "materials" {
  name           = "${var.APP_ENV}${var.tables.TABLE.MATERIALS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  stream_enabled = true  # Enable DynamoDB Stream
  stream_view_type = "NEW_AND_OLD_IMAGES"  # Include both new and old images in the stream

  tags = {
    Name        = "${var.tables.TABLE.MATERIALS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }

}

resource "aws_dynamodb_table" "archived_materials" {
  name           = "${var.APP_ENV}${var.tables.TABLE.ARCHIVED_MATERIALS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.ARCHIVED_MATERIALS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }

}

# Add Trigger to AWS Lambda Function
resource "aws_lambda_event_source_mapping" "dynamodb_materials_lambda_trigger" {
  event_source_arn  = aws_dynamodb_table.materials.stream_arn  # ARN of the DynamoDB Stream
  function_name     = aws_lambda_function.logs.function_name   # Name of the Lambda function
  starting_position = "LATEST"                                 # Starting position for the event stream (can be "TRIM_HORIZON" or "LATEST", here using "LATEST")
  batch_size        = 10                                       # Batch size for the event source mapping
}

resource "aws_dynamodb_table" "material_chains" {
  name           = "${var.APP_ENV}${var.tables.TABLE.MATERIAL_CHAINS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.MATERIAL_CHAINS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "material_cmacs" {
  name           = "${var.APP_ENV}${var.tables.TABLE.MATERIAL_CMACS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.MATERIAL_CMACS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "simulations" {
  name           = "${var.APP_ENV}${var.tables.TABLE.SIMULATIONS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.SIMULATIONS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "simulation_files" {
  name           = "${var.APP_ENV}${var.tables.TABLE.SIMULATION_FILES}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.SIMULATION_FILES}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "users" {
  name           = "${var.APP_ENV}${var.tables.TABLE.USERS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.USERS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "equipments" {
  name           = "${var.APP_ENV}${var.tables.TABLE.EQUIPMENTS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  stream_enabled = true  # Enable DynamoDB Stream
  stream_view_type = "NEW_AND_OLD_IMAGES"  # Include both new and old images in the stream


  tags = {
    Name        = "${var.tables.TABLE.EQUIPMENTS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "archived_equipments" {
  name           = "${var.APP_ENV}${var.tables.TABLE.ARCHIVED_EQUIPMENTS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.ARCHIVED_EQUIPMENTS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

# Add Trigger to AWS Lambda Function
resource "aws_lambda_event_source_mapping" "dynamodb_equipments_lambda_trigger" {
  event_source_arn  = aws_dynamodb_table.equipments.stream_arn  # ARN of the DynamoDB Stream
  function_name     = aws_lambda_function.logs.function_name   # Name of the Lambda function
  starting_position = "LATEST"                                 # Starting position for the event stream (can be "TRIM_HORIZON" or "LATEST", here using "LATEST")
  batch_size        = 10                                       # Batch size for the event source mapping
}

resource "aws_dynamodb_table" "logs" {
  name           = "${var.APP_ENV}${var.tables.TABLE.LOGS}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "partition_key"
  range_key      = "sort_key"


  attribute {
    name = "partition_key"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  tags = {
    Name        = "${var.tables.TABLE.LOGS}_table"
    Environment = "${var.APP_ENV}"
  }

  lifecycle {
    ignore_changes  = [tags, billing_mode, hash_key, range_key, attribute]
    prevent_destroy = false
  }
}

