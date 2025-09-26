# module "iam" {
#   source = "../Dev/modules/IAM"

#   # APPROLE_ID       = var.APPROLE_ID
#   # SECRET_ID        = var.SECRET_ID
#   # app-env          = var.app-env
#   # tec-account-name = var.tec-account-name
# }

# module "S3" {
#   source = "../Dev/modules/S3"

#   # APPROLE_ID         = var.APPROLE_ID
#   # SECRET_ID          = var.SECRET_ID
#   # app-env            = var.app-env
#   # tec-account-name   = var.tec-account-name
#   # it-technical-owner = var.it-technical-owner
#   # application-name   = var.application-name
#   # application-owner  = var.application-owner
#   # apms-id            = var.apms-id
#   # purpose            = var.purpose
# }

# #module "StaticWebsite" {
# #  source = "../Dev/modules/StaticWebsite"
# #
# #  APPROLE_ID = var.APPROLE_ID
# #  SECRET_ID  = var.SECRET_ID
# #
# #  S3_description           = var.S3_description
# #  origin_id                = var.origin_id
# #  purpose                  = var.static-website-purpose
# #  resource_record          = var.resource_record
# #  server_access_log_bucket = var.server_access_log_bucket
# #  cloudfront_log_bucket    = var.cloudfront_log_bucket
# #  webacl_name              = var.webacl_name
# #}

# module "LAMBDA" {
#   source     = "../Dev/modules/LAMBDA"
#   # APPROLE_ID = var.APPROLE_ID
#   # SECRET_ID  = var.SECRET_ID
# }

# module "DDB" {
#   source     = "../Dev/modules/DDB"
#   # APPROLE_ID = var.APPROLE_ID
#   # SECRET_ID  = var.SECRET_ID
# }

# module "APIGATEWAY" {
#   source = "../Dev/modules/APIGATEWAY"

#   # APPROLE_ID         = var.APPROLE_ID
#   # SECRET_ID          = var.SECRET_ID
#   # app-env            = var.app-env
#   # tec-account-name   = var.tec-account-name
#   # it-technical-owner = var.it-technical-owner
#   # application-name   = var.application-name
#   # application-owner  = var.application-owner
#   # apms-id            = var.apms-id
#   # purpose            = var.purpose
# }
