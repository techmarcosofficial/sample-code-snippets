terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.22.0"
    }
  }
  required_version = ">=1.2.1"
}

# provider "vault" {

#   auth_login {
#     path   = "auth/approle/login"
#     method = "approle"

#     parameters = {
#       role_id   = var.APPROLE_ID
#       secret_id = var.SECRET_ID
#     }
#   }
# }

# data "vault_aws_access_credentials" "creds" {
#   backend = "aws"
#   role    = "tec-rnd-sci-dev-TerraformIaC"
#   type    = "sts"
# }

# provider "aws" {
#   region     = var.region
#   access_key = data.vault_aws_access_credentials.creds.access_key
#   secret_key = data.vault_aws_access_credentials.creds.secret_key
#   token      = data.vault_aws_access_credentials.creds.security_token
# }