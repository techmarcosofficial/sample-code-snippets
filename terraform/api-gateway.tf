
resource "aws_apigatewayv2_api" "marcos_api" {
  name          = "${var.APP_ENV}-marcos-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_headers = var.allowed_headers
    allow_methods = var.allowed_methods
    allow_origins = var.allowed_origins
    expose_headers = [
      "date",
      "x-api-id"
    ]
    max_age           = var.max_age
    allow_credentials = true
  }

  # Logging Configuration
  #policy_arn = aws_iam_policy.cloudwatch_logs_full_access_policy.arn

  lifecycle {
    prevent_destroy = false
  }
}

# Example CloudWatch Log Group
resource "aws_cloudwatch_log_group" "marcos_api_logs" {
  name = "APIGatewayMarcosLogGroup"

  lifecycle {
    prevent_destroy = false
  }
}


resource "aws_apigatewayv2_integration" "materials_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Materials Lambda"
  integration_uri        = aws_lambda_function.materials.arn
  payload_format_version = "2.0"


  lifecycle {
    prevent_destroy = false
  }
}

#MATERIAL ROUTES
resource "aws_apigatewayv2_route" "get_materials" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.GET_MATERIALS

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.GET_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"


  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "save_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.POST_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "update_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.PUT_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "search_materials" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.SEARCH_MATERIALS

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "find_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.FIND_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "clone_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.CLONE_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "export_materials" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.EXPORT_MATERIALS

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "list_vendor_material_names" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.LIST_VENDOR_MATERIAL_NAMES

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "list_vendor_material_lot_numbers" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.LIST_VENDOR_MATERIAL_LOT_NUMBERS

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}
resource "aws_apigatewayv2_route" "delete_material" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.MATERIAL.DELETE_MATERIAL

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "list_liquid_solvent_names" {
  api_id    = aws_apigatewayv2_api.marcos_api.id
  route_key = var.routes.MATERIAL.LIST_LIQUID_SOLVENTS

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "material_log_report_pdf" {
  api_id    = aws_apigatewayv2_api.marcos_api.id
  route_key = var.routes.MATERIAL.LOG_REPORT_PDF

  target = "integrations/${aws_apigatewayv2_integration.materials_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#FILE ROUTES
resource "aws_apigatewayv2_integration" "upload_files_integration" {
  api_id = aws_apigatewayv2_api.marcos_api.id

  integration_type = "AWS_PROXY"

  description            = "Upload Files Lambda"
  integration_uri        = aws_lambda_function.upload_files.arn
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "upload_files" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.FILE.FILES_UPLOAD

  target = "integrations/${aws_apigatewayv2_integration.upload_files_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_integration" "download_file_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Download FIle Lambda"
  integration_uri        = aws_lambda_function.download_file.arn
  payload_format_version = "2.0"


  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "download_file" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.FILE.FILES_DOWNLOAD

  target = "integrations/${aws_apigatewayv2_integration.download_file_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}


resource "aws_apigatewayv2_integration" "delete_files_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Delete Files Lambda"
  integration_uri        = aws_lambda_function.delete_files.arn
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "delete_files" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.FILE.FILES_DELETE

  target = "integrations/${aws_apigatewayv2_integration.delete_files_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#SIMULATION ROUTES
resource "aws_apigatewayv2_integration" "simulations_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Simulations Lambda"
  integration_uri        = aws_lambda_function.simulations.arn
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }

}
resource "aws_apigatewayv2_route" "save_simulations_data" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.SIMULATIONS.SAVE_SIMULATION_DATA

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"


  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_simulations_graph_data" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.SIMULATIONS.GET_SIMULATIONS_GRAPH_DATA

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_simulations_model_1_2_data" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.SIMULATIONS.GET_SIMULATIONS_MODEL_1_2_DATA

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_integration" "simulations_model3_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Simulations Model 3 Lambda"
  integration_uri        = "arn:aws:lambda:us-east-1:314764559768:function:model3Python" #TODO : replace with lambda ARN
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_simulations_model_3_data" {
  api_id    = aws_apigatewayv2_api.marcos_api.id
  route_key = var.routes.SIMULATIONS.GET_SIMULATIONS_MODEL_3_DATA

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

# resource "aws_apigatewayv2_route" "caculate_model_4" {
#  api_id    = aws_apigatewayv2_api.marcos_api.id
#  route_key = var.routes.SIMULATIONS.CALCULATE_MODEL_4

#  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

#  lifecycle {
#    prevent_destroy = false
#  }
# }


resource "aws_apigatewayv2_integration" "cmac_model_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "CMAC Model Lambda"
  integration_uri        = aws_lambda_function.cmac_model.arn
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "cmac_model_save" {
 api_id    = aws_apigatewayv2_api.marcos_api.id
 route_key = var.routes.CMAC_MODEL.SAVE

 target = "integrations/${aws_apigatewayv2_integration.cmac_model_integration.id}"

 lifecycle {
   prevent_destroy = false
 }
}

resource "aws_apigatewayv2_route" "cmac_model_get" {
 api_id    = aws_apigatewayv2_api.marcos_api.id
 route_key = var.routes.CMAC_MODEL.GET

 target = "integrations/${aws_apigatewayv2_integration.cmac_model_integration.id}"

 lifecycle {
   prevent_destroy = false
 }
}

resource "aws_apigatewayv2_route" "cmac_model_update" {
 api_id    = aws_apigatewayv2_api.marcos_api.id
 route_key = var.routes.CMAC_MODEL.UPDATE

 target = "integrations/${aws_apigatewayv2_integration.cmac_model_integration.id}"

 lifecycle {
   prevent_destroy = false
 }
}

resource "aws_apigatewayv2_route" "cmac_model_delete" {
 api_id    = aws_apigatewayv2_api.marcos_api.id
 route_key = var.routes.CMAC_MODEL.DELETE

 target = "integrations/${aws_apigatewayv2_integration.cmac_model_integration.id}"

 lifecycle {
   prevent_destroy = false
 }
}

resource "aws_apigatewayv2_route" "delete_simulation_data" {
  api_id    = aws_apigatewayv2_api.marcos_api.id
  route_key = var.routes.SIMULATIONS.DELETE_SIMULATION_DATA

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "save_simulations_files" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.SIMULATIONS.SAVE_SIMULATIONS_FILES

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_simulations_files" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.SIMULATIONS.GET_SIMULATIONS_FILES

  target = "integrations/${aws_apigatewayv2_integration.simulations_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}


#EQUIPMENT ROUTES
resource "aws_apigatewayv2_integration" "equipments_integration" {
  api_id = aws_apigatewayv2_api.marcos_api.id

  integration_type = "AWS_PROXY"

  description            = "Equipments Lambda"
  integration_uri        = aws_lambda_function.equipments.arn
  payload_format_version = "2.0"

  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "post_equipments" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.POST_EQUIPMENTS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "put_equipments" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.PUT_EQUIPMENTS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_equipments" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.GET_EQUIPMENTS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_equipment" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.GET_EQUIPMENT

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "delete_equipment" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.DELETE_EQUIPMENT

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "find_equipment" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.FIND_EQUIPMENT

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "search_equipments" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.SEARCH_EQUIPMENTS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "equipments_owners" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.LIST_EQUIPMENT_OWNERS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "equipments_tag_numbers" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.LIST_EQUIPMENT_TAG_NUMBERS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "equipment_log_report_pdf" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.LOG_REPORT_PDF

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "clone_equipment" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.CLONE_EQUIPMENT

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "export_equipments" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.EQUIPMENTS.EXPORT_EQUIPMENTS

  target = "integrations/${aws_apigatewayv2_integration.equipments_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}



#USERS ROUTES
resource "aws_apigatewayv2_integration" "users_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Users Lambda"
  integration_uri        = aws_lambda_function.users.arn
  payload_format_version = "2.0"


  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "post_users" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.POST_USERS

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "put_users" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.PUT_USERS

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_users" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.GET_USERS

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "get_user" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.GET_USER

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "save_okta_user" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.SAVE_OKTA_USER

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "create_okta_webhook" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.USERS.CREATE_OKTA_WEBHOOK

  target = "integrations/${aws_apigatewayv2_integration.users_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#TEST ROUTES
resource "aws_apigatewayv2_integration" "test_integration" {
  api_id = aws_apigatewayv2_api.marcos_api.id

  integration_type = "AWS_PROXY"

  description            = "Test Lambda"
  integration_uri        = aws_lambda_function.test.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.test]

  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "get_test" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key          = var.routes.TEST.GET_TEST

  depends_on = [aws_apigatewayv2_integration.test_integration]

  target = "integrations/${aws_apigatewayv2_integration.test_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "post_test" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key          = var.routes.TEST.POST_TEST

  depends_on = [aws_apigatewayv2_integration.test_integration]

  target = "integrations/${aws_apigatewayv2_integration.test_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}


#TEST ROUTES
resource "aws_apigatewayv2_integration" "logs_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Test Lambda"
  integration_uri        = aws_lambda_function.logs.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.logs]


  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "get_logs" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.LOG.GET_LOGS

  depends_on = [aws_apigatewayv2_integration.logs_integration]

  target = "integrations/${aws_apigatewayv2_integration.logs_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "post_logs" {
  api_id             = aws_apigatewayv2_api.marcos_api.id
  authorizer_id      = aws_apigatewayv2_authorizer.marcos_authorizer.id
  authorization_type = "JWT"
  route_key          = var.routes.LOG.SAVE_LOG

  depends_on = [aws_apigatewayv2_integration.logs_integration]

  target = "integrations/${aws_apigatewayv2_integration.logs_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}


#AWS Q ROUTES
resource "aws_apigatewayv2_integration" "aws_q_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Test Lambda"
  integration_uri        = aws_lambda_function.get_aws_q.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.get_aws_q]


  lifecycle {
    prevent_destroy = false
  }

}
resource "aws_apigatewayv2_route" "get_aws_q" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.AWS_Q.GET_CHAT

  depends_on = [aws_apigatewayv2_integration.aws_q_integration]

  target = "integrations/${aws_apigatewayv2_integration.aws_q_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#CRYSTALLIZATION ROUTES
resource "aws_apigatewayv2_integration" "crystallization_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Crystallization Lambda"
  integration_uri        = aws_lambda_function.crystallization.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.crystallization]


  lifecycle {
    prevent_destroy = false
  }

}
resource "aws_apigatewayv2_route" "crystallization" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.SIMULATIONS.CRYSTALLIZATION_MODEL

  depends_on = [aws_apigatewayv2_integration.crystallization_integration]

  target = "integrations/${aws_apigatewayv2_integration.crystallization_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#CRYSTALLIZATION TOOL ROUTES
resource "aws_apigatewayv2_integration" "crystallization_tool_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Crystallization Lambda"
  integration_uri        = aws_lambda_function.crystallization_tool.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.crystallization_tool]


  lifecycle {
    prevent_destroy = false
  }

}

resource "aws_apigatewayv2_route" "crystallization_tool" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.SIMULATIONS.CRYSTALLIZATION_TOOL

  depends_on = [aws_apigatewayv2_integration.crystallization_tool_integration]

  target = "integrations/${aws_apigatewayv2_integration.crystallization_tool_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

#MATERIAL CHAIN ROUTES
resource "aws_apigatewayv2_integration" "material_chains_integration" {
  api_id           = aws_apigatewayv2_api.marcos_api.id
  integration_type = "AWS_PROXY"

  description            = "Material Chains"
  integration_uri        = aws_lambda_function.material_chains.invoke_arn
  payload_format_version = "2.0"

  depends_on = [aws_apigatewayv2_api.marcos_api, aws_lambda_function.material_chains]


  lifecycle {
    prevent_destroy = false
  }

}
resource "aws_apigatewayv2_route" "get_material_chains" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.MATERIAL_CHAINS.GET

  depends_on = [aws_apigatewayv2_integration.material_chains_integration]

  target = "integrations/${aws_apigatewayv2_integration.material_chains_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "genrate_material_chains" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.MATERIAL_CHAINS.GENERATE

  depends_on = [aws_apigatewayv2_integration.material_chains_integration]

  target = "integrations/${aws_apigatewayv2_integration.material_chains_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "save_material_chains" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.MATERIAL_CHAINS.SAVE

  depends_on = [aws_apigatewayv2_integration.material_chains_integration]

  target = "integrations/${aws_apigatewayv2_integration.material_chains_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_apigatewayv2_route" "update_material_chains" {
  api_id = aws_apigatewayv2_api.marcos_api.id
  # authorizer_id = aws_apigatewayv2_authorizer.marcos_authorizer.id
  # authorization_type = "JWT"
  route_key = var.routes.MATERIAL_CHAINS.UPDATE

  depends_on = [aws_apigatewayv2_integration.material_chains_integration]

  target = "integrations/${aws_apigatewayv2_integration.material_chains_integration.id}"

  lifecycle {
    prevent_destroy = false
  }
}



////////WRITE SATGE
resource "aws_apigatewayv2_stage" "marcos_stage" {
  api_id      = aws_apigatewayv2_api.marcos_api.id
  auto_deploy = true
  name        = var.APP_ENV

  default_route_settings {
    throttling_burst_limit = 5000
    throttling_rate_limit  = 10000
  }

  lifecycle {
    prevent_destroy = false
  }
}

# Define the payload JSON
variable "lambda_payload" {
  type    = string
  default = <<JSON
{
  "body": {
    "event_bridge": "invoke lambda"
  }
}
JSON
}


resource "aws_cloudwatch_event_rule" "invoke_model_3_scheduler_rule" {
  name                = "invoke-model-3-scheduler"
  event_bus_name      = "default"
  schedule_expression = "rate(1 hour)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "invoke_model_3_lambda" {
  rule = aws_cloudwatch_event_rule.invoke_model_3_scheduler_rule.name
  # target_id = "invoke_lambda_target"
  arn   = "arn:aws:lambda:us-east-1:${local.account_id}:function:marcos-model-3"
  input = var.lambda_payload
}

resource "aws_lambda_permission" "invoke_model_3_scheduler_rule_lambda_permission" {

  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "marcos-model-3"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.invoke_model_3_scheduler_rule.arn
}

#Solvent list
