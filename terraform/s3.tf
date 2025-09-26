resource "aws_s3_bucket" "marcos_s3" {
  # count  = var.prevent_destroy ? 1 : 0
  bucket = "${var.APP_ENV}${var.S3_BUCKET_NAME}"

  tags = {
    Name        = "${var.APP_ENV}${var.S3_BUCKET_NAME}"
    Environment = "${var.APP_ENV}"
  }
  lifecycle {
    prevent_destroy = false
  }
}


resource "aws_s3_bucket_cors_configuration" "marcos_s3_cors" {
  bucket = aws_s3_bucket.marcos_s3.id

  cors_rule {
    allowed_headers = var.allowed_headers
    allowed_methods = var.allowed_s3_methods
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = var.max_age
  }

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
  }
  lifecycle {
    prevent_destroy = false
  }
}


# resource "aws_s3_bucket_policy" "marcos_s3_bucket_policy" {
#   bucket = aws_s3_bucket.marcos_s3.id

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Sid       = "AllowOnlySignedAccess",
#         Effect    = "Deny",
#         Principal = "*",
#         Action    = "s3:GetObject",
#         Resource  = "${aws_s3_bucket.marcos_s3.arn}/*",
#         Condition = {
#           StringNotEquals = {
#             "aws:ViaAWSService" = "s3.amazonaws.com"
#           }
#         }
#       }
#     ]
#   })
# }

resource "aws_s3_bucket_public_access_block" "marcos_s3_block_public" {
  bucket = aws_s3_bucket.marcos_s3.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}



#ASSET BUCKET
resource "aws_s3_bucket" "marcos_s3_asset" {
  # count  = var.prevent_destroy ? 1 : 0
  bucket = "${var.APP_ENV}${var.ASSET_BUCKET}"

  tags = {
    Name        = "${var.APP_ENV}${var.ASSET_BUCKET}"
    Environment = "${var.APP_ENV}"
  }
  lifecycle {
    prevent_destroy = false
  }
}


resource "aws_s3_bucket_cors_configuration" "marcos_s3_asset_cors" {
  bucket = aws_s3_bucket.marcos_s3_asset.id

  cors_rule {
    allowed_headers = var.allowed_headers
    allowed_methods = var.allowed_s3_methods
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = var.max_age
  }

  cors_rule {
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
  }
  lifecycle {
    prevent_destroy = false
  }
}



