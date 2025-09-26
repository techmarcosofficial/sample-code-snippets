#IaC Lambda Functions
data "archive_file" "aws_node_sdk_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-node-sdk/"
  output_path = "${path.module}/zips/aws-node-sdk.zip"
}

# Python requests layer
resource "aws_lambda_layer_version" "aws_node_sdk_layer" {

  layer_name = "aws_node18x_sdk_layer"

  filename         = data.archive_file.aws_node_sdk_zip.output_path
  source_code_hash = data.archive_file.aws_node_sdk_zip.output_base64sha256

  compatible_runtimes = ["nodejs18.x"]
}


data "archive_file" "makepdf_zip" {
  type        = "zip"
  source_dir  = "${path.module}/makepdf-layer/"
  output_path = "${path.module}/zips/makepdf-layer.zip"
}

# Python requests layer
resource "aws_lambda_layer_version" "makepdf_layer" {

  layer_name = "makepdf_node18x_layer"

  filename         = data.archive_file.makepdf_zip.output_path
  source_code_hash = data.archive_file.makepdf_zip.output_base64sha256

  compatible_runtimes = ["nodejs18.x"]
}

data "archive_file" "materials_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-materials/"
  output_path = "${path.module}/aws-materials/aws-materials.zip"
}

resource "aws_lambda_function" "materials" {
  function_name = "${var.APP_ENV}-materials"

  filename         = data.archive_file.materials_zip.output_path
  source_code_hash = data.archive_file.materials_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "materials.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true

  layers = [ 
    aws_lambda_layer_version.makepdf_layer.arn,
    aws_lambda_layer_version.aws_node_sdk_layer.arn
   ]

  depends_on = [
    aws_cloudwatch_log_group.cloudwatch_materials_logs
  ]

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME  = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET    = "${var.APP_ENV}${var.ASSET_BUCKET}"
      MATERIALS_TABLE = "${var.APP_ENV}${var.tables.TABLE.MATERIALS}"
      APP_ENV         = "${var.APP_ENV}"
    }
  }
}

data "archive_file" "files_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-files/"
  output_path = "${path.module}/aws-files/aws-files.zip"
}

resource "aws_lambda_function" "upload_files" {
  function_name = "${var.APP_ENV}-upload-files"

  filename         = data.archive_file.files_zip.output_path
  source_code_hash = data.archive_file.files_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600


  lifecycle {
    ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}

resource "aws_lambda_function" "download_file" {
  function_name = "${var.APP_ENV}-download-file"

  filename         = data.archive_file.files_zip.output_path
  source_code_hash = data.archive_file.files_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "download-file.handler"
  runtime = "nodejs18.x"
  timeout = 600


  lifecycle {
    ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}

resource "aws_lambda_function" "delete_files" {
  function_name = "${var.APP_ENV}-delete-files"

  filename         = data.archive_file.files_zip.output_path
  source_code_hash = data.archive_file.files_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "delete-files.handler"
  runtime = "nodejs18.x"
  timeout = 600


  lifecycle {
    ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}

data "archive_file" "simulations_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-simulations/"
  output_path = "${path.module}/aws-simulations/aws-simulations.zip"
}

resource "aws_lambda_function" "simulations" {
  function_name = "${var.APP_ENV}-simulations"

  filename         = data.archive_file.simulations_zip.output_path
  source_code_hash = data.archive_file.simulations_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "simulations.handler"
  runtime = "nodejs18.x"
  timeout = 600


  lifecycle {
    ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME         = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      SIMULATIONS_TABLE      = "${var.APP_ENV}${var.tables.TABLE.SIMULATIONS}"
      SIMULATION_FILES_TABLE = "${var.APP_ENV}${var.tables.TABLE.SIMULATION_FILES}"
      APP_ENV                = "${var.APP_ENV}"
    }
  }
}

data "archive_file" "equipments_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-equipments/"
  output_path = "${path.module}/aws-equipments/aws-equipments.zip"
}

resource "aws_lambda_function" "equipments" {
  function_name = "${var.APP_ENV}-equipments"

  filename         = data.archive_file.equipments_zip.output_path
  source_code_hash = data.archive_file.equipments_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "equipments.handler"
  runtime = "nodejs18.x"
  timeout = 600

  layers = [ 
    aws_lambda_layer_version.makepdf_layer.arn,
    aws_lambda_layer_version.aws_node_sdk_layer.arn
   ]

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME   = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET     = "${var.APP_ENV}${var.ASSET_BUCKET}"
      EQUIPMENTS_TABLE = "${var.APP_ENV}${var.tables.TABLE.EQUIPMENTS}"
      APP_ENV          = "${var.APP_ENV}"
    }
  }
}

data "archive_file" "users_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-users/"
  output_path = "${path.module}/aws-users/aws-users.zip"
}

resource "aws_lambda_function" "users" {
  function_name = "${var.APP_ENV}-users"

  filename         = data.archive_file.users_zip.output_path
  source_code_hash = data.archive_file.users_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "users.handler"
  runtime = "nodejs18.x"
  timeout = 600


  lifecycle {
    ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      USERS_TABLE    = "${var.APP_ENV}${var.tables.TABLE.USERS}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}

data "archive_file" "test_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-test/"
  output_path = "${path.module}/aws-test/aws-test.zip"
}

resource "aws_lambda_function" "test" {
  function_name = "${var.APP_ENV}-test"

  filename         = data.archive_file.test_zip.output_path
  source_code_hash = data.archive_file.test_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true


  depends_on = [aws_cloudwatch_log_group.cloudwatch_test_logs]

  lifecycle {
    //ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

}


data "archive_file" "logs_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-logs/"
  output_path = "${path.module}/aws-logs/aws-logs.zip"
}

resource "aws_lambda_function" "logs" {
  function_name = "${var.APP_ENV}-logs"

  filename         = data.archive_file.logs_zip.output_path
  source_code_hash = data.archive_file.logs_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true


  depends_on = [aws_cloudwatch_log_group.cloudwatch_logs_logs]

  lifecycle {
    //ignore_changes  = [layers, filename]
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }

}

#AWS Q
data "archive_file" "aws_q_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-q/"
  output_path = "${path.module}/aws-q/aws-q.zip"
}

resource "aws_lambda_function" "get_aws_q" {
  function_name = "${var.APP_ENV}-aws-q"

  filename         = data.archive_file.aws_q_zip.output_path
  source_code_hash = data.archive_file.aws_q_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true


  depends_on = [aws_cloudwatch_log_group.cloudwatch_aws_q_logs]

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}


#CMAC MODEL

data "archive_file" "cmac_model_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-cmac-model/"
  output_path = "${path.module}/zips/aws-cmac-model.zip"
}
resource "aws_lambda_function" "cmac_model" {
  function_name = "${var.APP_ENV}-cmac-model"

  filename         = data.archive_file.cmac_model_zip.output_path
  source_code_hash = data.archive_file.cmac_model_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true


  depends_on = [aws_cloudwatch_log_group.cloudwatch_cmac_model_logs]

  ephemeral_storage {
    size = 2048 # Min 512 MB and the Max 10240 MB
  }
  memory_size = 2048

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}



#CRYSTALLIZATION LAMBDA
data "archive_file" "crystallization_openpyxl_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-crystallization-openpyxl/"
  output_path = "${path.module}/zips/aws-crystallization-openpyxl.zip"
}

# Python requests layer
resource "aws_lambda_layer_version" "crystallization_openpyxl_layer" {

  layer_name = "python310_openpyxl_layer"

  filename         = data.archive_file.crystallization_openpyxl_zip.output_path
  source_code_hash = data.archive_file.crystallization_openpyxl_zip.output_base64sha256

  compatible_runtimes = ["python3.10"]
}

data "archive_file" "crystallization_plotly_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-crystallization-plotly/"
  output_path = "${path.module}/zips/aws-crystallization-plotly.zip"
}

# Python requests layer
resource "aws_lambda_layer_version" "crystallization_plotly_layer" {

  layer_name = "python310_plotly_layer"

  filename         = data.archive_file.crystallization_plotly_zip.output_path
  source_code_hash = data.archive_file.crystallization_plotly_zip.output_base64sha256

  compatible_runtimes = ["python3.10"]
}

data "archive_file" "crystallization_numpy_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-crystallization-numpy/"
  output_path = "${path.module}/zips/aws-crystallization-numpy.zip"
}

# Python requests layer
resource "aws_lambda_layer_version" "crystallization_numpy_layer" {

  layer_name = "python310_numpy_layer"

  filename         = data.archive_file.crystallization_numpy_zip.output_path
  source_code_hash = data.archive_file.crystallization_numpy_zip.output_base64sha256

  compatible_runtimes = ["python3.10"]
}


data "archive_file" "crystallization_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-crystallization/"
  output_path = "${path.module}/zips/aws-crystallization.zip"
}

resource "aws_lambda_function" "crystallization" {
  function_name = "${var.APP_ENV}-crystallization-model"

  filename         = data.archive_file.crystallization_zip.output_path
  source_code_hash = data.archive_file.crystallization_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "app.lambda_handler"
  runtime = "python3.10"
  timeout = 600
  publish = true

  layers = [
    aws_lambda_layer_version.crystallization_openpyxl_layer.arn,
    aws_lambda_layer_version.crystallization_plotly_layer.arn,
    aws_lambda_layer_version.crystallization_numpy_layer.arn,
  ]

  depends_on = [aws_cloudwatch_log_group.cloudwatch_crystallization_logs]

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }

}

resource "aws_lambda_function" "crystallization_tool" {
  function_name = "${var.APP_ENV}-crystallization-tool"
  role          = aws_iam_role.marcos_role.arn
  # handler       = "app.lambda_handler"
  # runtime       = "python3.12"  # Specify the runtime for custom images
  memory_size   = 2048
  timeout       = 600
  publish       = true
  package_type  = "Image"

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }

  image_uri     = "${local.account_id}.dkr.ecr.us-east-1.amazonaws.com/${var.ecr_images.REPOSITORIES.CRYSTALLIZATION_TOOL}:${var.ecr_images.TAGS.CRYSTALLIZATION_TOOL}"
  # image_uri = "314764559768.dkr.ecr.us-east-1.amazonaws.com/crystallization_tool:latest2.3"

}

data "archive_file" "material_chains_zip" {
  type        = "zip"
  source_dir  = "${path.module}/aws-material-chains/"
  output_path = "${path.module}/zips/aws-material-chains.zip"

}

resource "aws_lambda_function" "material_chains" {
  function_name = "${var.APP_ENV}-material-chains"

  filename         = data.archive_file.material_chains_zip.output_path
  source_code_hash = data.archive_file.material_chains_zip.output_base64sha256

  role    = aws_iam_role.marcos_role.arn
  handler = "index.handler"
  runtime = "nodejs18.x"
  timeout = 600
  publish = true


  depends_on = [aws_cloudwatch_log_group.cloudwatch_material_chains_logs]

  lifecycle {
    prevent_destroy = false
  }

  environment {
    variables = {
      S3_BUCKET_NAME = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
      ASSET_BUCKET   = "${var.APP_ENV}${var.ASSET_BUCKET}"
      APP_ENV        = "${var.APP_ENV}"
    }
  }
}