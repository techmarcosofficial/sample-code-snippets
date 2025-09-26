locals {
  account_id = element(split(":", aws_apigatewayv2_api.marcos_api.execution_arn), 4)
}

output "account_id" {
  value = local.account_id
}

output "marcos_api_arn" {
  value = aws_apigatewayv2_api.marcos_api.arn
}

output "marcos_api_id" {
  value = aws_apigatewayv2_api.marcos_api.id
}

output "marcos_api_url" {
  value = aws_apigatewayv2_api.marcos_api.api_endpoint
}

#S3 Output
output "s3_bucket_arn" {
  value = aws_s3_bucket.marcos_s3.arn
}

output "s3_bucket_id" {
  value = aws_s3_bucket.marcos_s3.id
}

output "s3_bucket_region" {
  value = aws_s3_bucket.marcos_s3.region
}


#DDB Output
output "dynamodb_table_arn" {
  value = aws_dynamodb_table.materials.arn
}


#LAMBDA OUTPUT 
output "materials_arn" {
  value = aws_lambda_function.materials.arn
}

output "upload_files_arn" {
  value = aws_lambda_function.upload_files.arn
}

output "download_file_arn" {
  value = aws_lambda_function.download_file.arn
}

output "delete_files_arn" {
  value = aws_lambda_function.delete_files.arn
}

output "simulations_arn" {
  value = aws_lambda_function.simulations.arn
}



