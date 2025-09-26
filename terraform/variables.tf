variable "region" {
  type        = string
  description = "The AWS region. One of: `us-east-1`, `us-west-2`, `ap-northeast-1`, `ap-southeast-1`, `eu-central-1`, `eu-west-1`"
  default     = "us-east-1"
  validation {
    condition     = contains(["us-east-1", "us-west-2", "ap-northeast-1", "ap-southeast-1", "eu-central-1", "eu-west-1"], var.region)
    error_message = "Not a valid TEC AWS region!"
  }
}


variable "S3_BUCKET_NAME" {
  description = "S3_BUKET_NAME"
  default     = "-aws-marcos"
}

variable "ASSET_BUCKET" {
  description = "S3_BUKET_NAME"
  default     = "-aws-marcos-assets"
}

variable "APP_ENV" {
  type        = string
  description = "Name of the environment"
  default     = "dev"
}


variable "ecr_images" {
  description = "All Routes"
  default = {
    TAGS = {
      CRYSTALLIZATION_TOOL = "latest1.6"
    }
    REPOSITORIES = {
      CRYSTALLIZATION_TOOL = "crystallization_tool"
    }
    
  }
}


variable "routes" {
  description = "All Routes"
  default = {
    MATERIAL = {
      GET_MATERIALS                    = "GET /materials"
      GET_MATERIAL                     = "GET /materials/{id}"
      POST_MATERIAL                    = "POST /materials"
      PUT_MATERIAL                     = "PUT /materials"
      DELETE_MATERIAL                  = "POST /materials/delete"
      SEARCH_MATERIALS                 = "POST /materials/search"
      FIND_MATERIAL                    = "POST /materials/find"
      CLONE_MATERIAL                   = "POST /materials/clone"
      EXPORT_MATERIALS                 = "POST /materials/export"
      LIST_VENDOR_MATERIAL_NAMES       = "POST /materials/list-vendor-material-names"
      LIST_VENDOR_MATERIAL_LOT_NUMBERS = "POST /materials/list-vendor-material-lot-numbers"
      LIST_LIQUID_SOLVENTS             = "POST /materials/solvents"
      LOG_REPORT_PDF                   = "POST /materials/log-report-pdf"
    }
    MATERIAL_CHAINS = {
      GET      = "POST /material-chains/get"
      GENERATE = "POST /material-chains/generate"
      SAVE     = "POST /material-chains/save"
      UPDATE   = "POST /material-chains/update"
    }
    FILE = {
      FILES_UPLOAD   = "POST /files/upload"
      FILES_DOWNLOAD = "POST /files/download"
      FILES_DELETE   = "POST /files/delete"
    }
    SIMULATIONS = {
      SAVE_SIMULATION_DATA           = "POST /simulations"
      GET_SIMULATIONS_GRAPH_DATA     = "POST /simulations/get-graph-data"
      GET_SIMULATIONS_MODEL_1_2_DATA = "POST /simulations/model1-2"
      GET_SIMULATIONS_MODEL_3_DATA   = "POST /simulations/get-model-3-data"
      CALCULATE_MODEL_4              = "POST /simulations/model4"
      CRYSTALLIZATION_MODEL          = "POST /simulations/crystallization"
      CRYSTALLIZATION_TOOL           = "POST /simulations/crystallization-tool"
      SAVE_SIMULATIONS_FILES         = "POST /simulations/save-simulations-files-data"
      GET_SIMULATIONS_FILES          = "POST /simulations/get-simulations-files-data"
      GET_SIMULATIONS_FILES          = "POST /simulations/get-simulations-files-data"
      DELETE_SIMULATION_DATA         = "POST /simulations/delete"
    }
    USERS = {
      POST_USERS          = "POST /users"
      PUT_USERS           = "PUT /users/{id}"
      GET_USERS           = "GET /users"
      GET_USER            = "GET /users/{id}"
      UPDATE_PROFILE      = "POST /users/profile"
      SAVE_OKTA_USER      = "ANY /users/save-okta-user"
      CREATE_OKTA_WEBHOOK = "POST /users/create-webhook"
    }
    EQUIPMENTS = {
      POST_EQUIPMENTS            = "POST /equipments"
      PUT_EQUIPMENTS             = "PUT /equipments"
      GET_EQUIPMENTS             = "GET /equipments"
      GET_EQUIPMENT              = "GET /equipments/{id}"
      DELETE_EQUIPMENT           = "POST /equipments/delete"
      FIND_EQUIPMENT             = "POST /equipments/find"
      SEARCH_EQUIPMENTS          = "POST /equipments/search"
      CLONE_EQUIPMENT            = "POST /equipments/clone"
      EXPORT_EQUIPMENTS          = "POST /equipments/export"
      LIST_EQUIPMENT_OWNERS      = "POST /equipments/list-equipment-owners"
      LIST_EQUIPMENT_TAG_NUMBERS = "POST /equipments/list-equipment-tag-numbers"
      LOG_REPORT_PDF             = "POST /equipments/log-report-pdf"
    }
    TEST = {
      GET_TEST  = "GET /test"
      POST_TEST = "POST /test"
    }

    LOG = {
      GET_LOGS = "POST /logs/get"
      SAVE_LOG = "POST /logs/save"
    }

    AWS_Q = {
      GET_CHAT = "POST /aws-q/get"
    }
    CMAC_MODEL = {
      SAVE = "POST /cmac-model/save",
      GET = "POST /cmac-model/get",
      UPDATE = "POST /cmac-model/update",
      DELETE = "POST /cmac-model/delete",
    }
  }
}


variable "paths" {
  description = "All Paths"
  default = {
    MATERIAL = {
      GET_MATERIALS                    = "/materials"
      GET_MATERIAL                     = "/materials/{id}"
      POST_MATERIAL                    = "/materials"
      PUT_MATERIAL                     = "/materials"
      DELETE_MATERIAL                  = "/materials/delete"
      SEARCH_MATERIALS                 = "/materials/search"
      FIND_MATERIAL                    = "/materials/find"
      CLONE_MATERIAL                   = "/materials/clone"
      EXPORT_MATERIALS                 = "/materials/export"
      LIST_VENDOR_MATERIAL_NAMES       = "/materials/list-vendor-material-names"
      LIST_VENDOR_MATERIAL_LOT_NUMBERS = "/materials/list-vendor-material-lot-numbers"
      LIST_LIQUID_SOLVENTS             = "/materials/solvents"
      LOG_REPORT_PDF                   = "/materials/log-report-pdf"
    }
    MATERIAL_CHAINS = {
      GET      = "/material-chains/get"
      GENERATE = "/material-chains/generate"
      SAVE     = "/material-chains/save"
      UPDATE   = "/material-chains/update"
    }
    FILE = {
      FILES_UPLOAD   = "/files/upload"
      FILES_DOWNLOAD = "/files/download"
      FILES_DELETE   = "/files/delete"
    }
    SIMULATIONS = {
      SAVE_SIMULATION_DATA           = "/simulations"
      GET_SIMULATIONS_GRAPH_DATA     = "/simulations/get-graph-data"
      GET_SIMULATIONS_MODEL_1_2_DATA = "/simulations/model1-2"
      GET_SIMULATIONS_MODEL_3_DATA   = "/simulations/get-model-3-data"
      CALCULATE_MODEL_4              = "/simulations/model4"
      CRYSTALLIZATION_MODEL          = "/simulations/crystallization"
      CRYSTALLIZATION_TOOL           = "/simulations/crystallization-tool"
      SAVE_SIMULATIONS_FILES         = "/simulations/save-simulations-files-data"
      GET_SIMULATIONS_FILES          = "/simulations/get-simulations-files-data"
      DELETE_SIMULATION_DATA         = "/simulations/delete"
    }
    USERS = {
      POST_USERS          = "/users"
      PUT_USERS           = "/users/{id}"
      GET_USERS           = "/users"
      GET_USER            = "/users/{id}"
      UPDATE_PROFILE      = "/users/profile"
      SAVE_OKTA_USER      = "/users/save-okta-user"
      CREATE_OKTA_WEBHOOK = "/users/create-webhook"
    }
    EQUIPMENTS = {
      POST_EQUIPMENTS            = "/equipments"
      PUT_EQUIPMENTS             = "/equipments"
      GET_EQUIPMENTS             = "/equipments"
      GET_EQUIPMENT              = "/equipments/{id}"
      DELETE_EQUIPMENT           = "/equipments/delete"
      FIND_EQUIPMENT             = "/equipments/find"
      SEARCH_EQUIPMENTS          = "/equipments/search"
      CLONE_EQUIPMENT            = "/equipments/clone"
      EXPORT_EQUIPMENTS          = "/equipments/export"
      LIST_EQUIPMENT_OWNERS      = "/equipments/list-equipment-owners"
      LIST_EQUIPMENT_TAG_NUMBERS = "/equipments/list-equipment-tag-numbers"
      LOG_REPORT_PDF             = "/equipments/log-report-pdf"
    }
    TEST = {
      GET_TEST  = "/test"
      POST_TEST = "/test"
    }

    LOG = {
      GET_LOGS = "/logs/get"
      SAVE_LOG = "/logs/save"
    }
    AWS_Q = {
      GET_CHAT = "/aws-q/get"
    }
    CMAC_MODEL = {
      SAVE = "/cmac-model/save",
      GET = "/cmac-model/get",
      UPDATE = "/cmac-model/update",
      DELETE = "/cmac-model/delete",
    }
  }
}

variable "tables" {
  description = "All Tables"
  default = {
    TABLE = {
      MATERIALS                 = "_materials"
      ARCHIVED_MATERIALS        = "_archived_materials"
      MATERIAL_CHAINS           = "_material_chains"
      MATERIAL_CMACS            = "_material_cmacs"
      USERS                     = "_users"
      EQUIPMENTS                = "_equipments"
      ARCHIVED_EQUIPMENTS       = "_archived_equipments"
      SIMULATIONS               = "_simulations"
      SIMULATION_FILES          = "_simulation_files"
      LOGS                      = "_logs"

    }
  }
}


variable "authorizer" {
  description = "Authorizer Configuration"
  default = {
    AUDIENCE         = "api://default"
    ISSUER           = "https://dev-test.okta.com/oauth2/default"
    IDENTITY_SOURCES = "$request.header.Authorization"
    NAME             = "AwsMarcosAuthorizer"
  }
}

variable "allowed_origins" {
  description = "Allowed Origins"
  default = [
    "http://localhost:8080"
  ]

}

variable "allowed_headers" {
  description = "Allowed Headers"
  default     = ["*"]
}

variable "allowed_methods" {
  description = "Allowed Methods"
  default     = ["*"]
}

variable "allowed_s3_methods" {
  description = "allowed S3 methods"
  default     = ["PUT", "POST", "GET"]
}

variable "max_age" {
  description = "Max Age in Seconds"
  default     = 3000
}

variable "prevent_destroy" {
  type        = bool
  description = "Prevent Resource From Destroy"
  default     = false
}


# variable "APPROLE_ID" {
#   type        = string
#   description = "The role id from Hashicorp Vault"
# }

# variable "SECRET_ID" {
#   type        = string
#   description = "The secret id from Hashicorp Vault of the associated role"
#   sensitive   = true
# }

# variable "tec-account-name" {
#   type        = string
#   description = "Name of the AWS account"
# }

# variable "app-env" {
#   type        = string
#   description = "Name of the environment"
# }

# variable "apms-id" {
#   type        = string
#   description = "APMS-ID of application"
# }

# variable "application-name" {
#   type        = string
#   description = "Name of the application"
# }

# variable "application-owner" {
#   type        = string
#   description = "Application owner"
# }

# variable "it-technical-owner" {
#   type        = string
#   description = "Technical owner of the application"
# }

# variable "purpose" {
#   type = string
# }

# variable "static-website-purpose" {
#   type = string
# }

# variable "origin_id" {
#   description = "target_origin_id and origin_id will need to matc. This is the unique identifier for the origin."
#   type        = string
# }

# variable "S3_description" {
#   description = "Description of the origin bucket"
#   type        = string
# }

# variable "server_access_log_bucket" {
#   type        = string
#   description = "Name of the server access log bucket in the account"
# }

# variable "resource_record" {
#   type        = string
#   description = "Resource Record to be created in one of the N1 private hosted zones, hosted in *tec-cpe-shs-prd"
# }

# variable "cloudfront_log_bucket" {
#   type        = string
#   description = "Name of Amazon S3 bucket to store the access logs in, for example, myawslogbucket.s3.amazonaws.com"
# }

# variable "webacl_name" {
#   description = "Name of the Web ACL. Add name when enabling WAF. Must be used if WAF is created."
#   type        = string
# }
