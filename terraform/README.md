<!-- BEGIN_TF_DOCS -->

# Introduction

Brief description of the module's purpose. Feel free to include any [links](https://www.ts.com) if needed.

We recommend the installation of [markdownlint](https://test.com/items?itemName=DavidAnson.vscode-markdownlint) in VSCode to validate your syntax for this introduction.

> Any important notes that the user should be aware of

# Examples

```hcl
# Call the module with a test configuration here

variable "APPROLE_ID" {
  type        = string
  description = "The role id from Hashicorp Vault"
}

variable "SECRET_ID" {
  type        = string
  description = "The secret id from Hashicorp Vault of the associated role"
  sensitive   = true
}

variable "region" {
  type        = string
  description = "The AWS region. One of: `us-east-1`, `us-west-2`, `ap-northeast-1`, `ap-southeast-1`, `eu-central-1`, `eu-west-1`"
  default     = "us-east-1"
  validation {
    condition     = contains(["us-east-1", "us-west-2", "ap-northeast-1", "ap-southeast-1", "eu-central-1", "eu-west-1"], var.region)
    error_message = "Not a valid TEC AWS region!"
  }
}

# Provide output values for the test configuration here

terraform {
  required_providers {
    vault = {
      source  = "hashicorp/vault"
      version = "3.8.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.22.0"
    }
  }
}

provider "aws" {
  region     = var.region
  access_key = data.vault_aws_access_credentials.creds.access_key
  secret_key = data.vault_aws_access_credentials.creds.secret_key
  token      = data.vault_aws_access_credentials.creds.security_token
}

provider "vault" {
  
  auth_login {
    path   = "auth/approle/login"
    method = "approle"

    parameters = {
      role_id   = var.APPROLE_ID
      secret_id = var.SECRET_ID
    }
  }
}

data "vault_aws_access_credentials" "creds" {
  backend = "aws"
  role    = "tec-xxx-xxx-xxx-TerraformIaC"
  type    = "sts"
}
```

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >=1.2.1 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 4.22.0 |

## Providers

No providers.

## Modules

No modules.

## Resources

No resources.

## Inputs

| Name | Description | Type | Default |
|------|-------------|------|---------|
| <a name="input_region"></a> [region](#input\_region) | The AWS region. One of: `us-east-1`, `us-west-2`, `ap-northeast-1`, `ap-southeast-1`, `eu-central-1`, `eu-west-1` | `string` | `"us-east-1"` |

## Outputs

No outputs.


<!-- END_TF_DOCS -->