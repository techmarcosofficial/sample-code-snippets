#MATERIAL ROUTES
resource "aws_lambda_permission" "get_material_lambda_permission" {
  statement_id  = "GET_MATERIAL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.GET_MATERIAL}"
}

resource "aws_lambda_permission" "materials_lambda_permission" {
  statement_id  = "MATERIALS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.GET_MATERIALS}"
}

resource "aws_lambda_permission" "find_material_lambda_permission" {
  statement_id  = "FIND_MATERIAL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.FIND_MATERIAL}"
}

resource "aws_lambda_permission" "search_materials_lambda_permission" {
  statement_id  = "SEARCH_MATERIALS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.SEARCH_MATERIALS}"
}

resource "aws_lambda_permission" "clone_material_lambda_permission" {
  statement_id  = "CLONE_MATERIAL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.CLONE_MATERIAL}"
}

resource "aws_lambda_permission" "export_materials_lambda_permission" {
  statement_id  = "EXPORT_MATERIALS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.EXPORT_MATERIALS}"
}

resource "aws_lambda_permission" "list_vendor_material_names_lambda_permission" {
  statement_id  = "LIST_VENDOR_MATERIAL_NAMES"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.LIST_VENDOR_MATERIAL_NAMES}"
}


resource "aws_lambda_permission" "list_vendor_material_lot_numbers_lambda_permission" {
  statement_id  = "LIST_VENDOR_MATERIAL_LOT_NUMBERS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.LIST_VENDOR_MATERIAL_LOT_NUMBERS}"
}

resource "aws_lambda_permission" "delete_material_lambda_permission" {
  statement_id  = "DELETE_MATERIAL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.DELETE_MATERIAL}"
}

resource "aws_lambda_permission" "list_liquid_solvent_names_permission" {
  statement_id  = "LIST_LIQUID_SOLVENTS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.LIST_LIQUID_SOLVENTS}"
}

resource "aws_lambda_permission" "material_log_report_pdf_permission" {
  statement_id  = "LOG_REPORT_PDF"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.materials.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL.LOG_REPORT_PDF}"
}

#FILE Permisssions
resource "aws_lambda_permission" "upload_files_lambda_permission" {
  statement_id  = "FILES_UPLOAD"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.upload_files.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.FILE.FILES_UPLOAD}"
}

resource "aws_lambda_permission" "download_file_lambda_permission" {
  statement_id  = "FILES_DOWNLOAD"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.download_file.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.FILE.FILES_DOWNLOAD}"
}


resource "aws_lambda_permission" "delete_files_lambda_permission" {
  statement_id  = "FILES_DELETE"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_files.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.FILE.FILES_DELETE}"
}

#SIMULATION PERMISSION
resource "aws_lambda_permission" "save_simulations_data_lambda_permission" {
  statement_id  = "SAVE_SIMULATION_DATA"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.SAVE_SIMULATION_DATA}"
}

resource "aws_lambda_permission" "get_simulations_graph_data_lambda_permission" {
  statement_id  = "GET_SIMULATIONS_GRAPH_DATA"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.GET_SIMULATIONS_GRAPH_DATA}"
}

resource "aws_lambda_permission" "get_simulations_model_1_2_data_lambda_permission" {
  statement_id  = "GET_SIMULATIONS_MODEL_1_2_DATA"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.GET_SIMULATIONS_MODEL_1_2_DATA}"
}

resource "aws_lambda_permission" "get_simulations_model_3_data_lambda_permission" {
  statement_id  = "GET_SIMULATIONS_MODEL_3_DATA"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.GET_SIMULATIONS_MODEL_3_DATA}"
}


# resource "aws_lambda_permission" "calculate_model_4_lambda_permission" {
#  statement_id  = "CALCULATE_MODEL_4"
#  action        = "lambda:InvokeFunction"
#  function_name = "Model4Simulation"
#  principal     = "apigateway.amazonaws.com"

#  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.CALCULATE_MODEL_4}"
# }

resource "aws_lambda_permission" "cmac_model_save_lambda_permission" {
 statement_id  = "CMAC_MODEL_SAVE"
 action        = "lambda:InvokeFunction"
 function_name = aws_lambda_function.cmac_model.function_name
 principal     = "apigateway.amazonaws.com"

 source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.CMAC_MODEL.SAVE}"
}

resource "aws_lambda_permission" "cmac_model_get_lambda_permission" {
 statement_id  = "CMAC_MODEL_GET"
 action        = "lambda:InvokeFunction"
 function_name = aws_lambda_function.cmac_model.function_name
 principal     = "apigateway.amazonaws.com"

 source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.CMAC_MODEL.GET}"
}

resource "aws_lambda_permission" "cmac_model_update_lambda_permission" {
 statement_id  = "CMAC_MODEL_UPDATE"
 action        = "lambda:InvokeFunction"
 function_name = aws_lambda_function.cmac_model.function_name
 principal     = "apigateway.amazonaws.com"

 source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.CMAC_MODEL.UPDATE}"
}

resource "aws_lambda_permission" "cmac_model_delete_lambda_permission" {
 statement_id  = "CMAC_MODEL_DELETE"
 action        = "lambda:InvokeFunction"
 function_name = aws_lambda_function.cmac_model.function_name
 principal     = "apigateway.amazonaws.com"

 source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.CMAC_MODEL.DELETE}"
}


resource "aws_lambda_permission" "save_simulations_files_lambda_permission" {
  statement_id  = "SAVE_SIMULATIONS_FILES"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.SAVE_SIMULATIONS_FILES}"
}


resource "aws_lambda_permission" "get_simulations_files_lambda_permission" {
  statement_id  = "GET_SIMULATIONS_FILES"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.GET_SIMULATIONS_FILES}"
}

resource "aws_lambda_permission" "delete_simulation_lambda_permission" {
  statement_id  = "DELETE_SIMULATION_DATA"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.simulations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.DELETE_SIMULATION_DATA}"
}




#EQUIPMENT PERMISSION
resource "aws_lambda_permission" "equipments_lambda_permission" {
  statement_id  = "EQUIPMENTS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.GET_EQUIPMENTS}"
}

resource "aws_lambda_permission" "get_equipment_lambda_permission" {
  statement_id  = "GET_EQUIPMENT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.GET_EQUIPMENT}"
}

resource "aws_lambda_permission" "find_equipment_lambda_permission" {
  statement_id  = "FIND_EQUIPMENT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.FIND_EQUIPMENT}"
}

resource "aws_lambda_permission" "search_equipments_lambda_permission" {
  statement_id  = "SEARCH_EQUIPMENTS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.SEARCH_EQUIPMENTS}"
}

resource "aws_lambda_permission" "equipment_owners_lambda_permission" {
  statement_id  = "LIST_EQUIPMENT_OWNERS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.LIST_EQUIPMENT_OWNERS}"
}


resource "aws_lambda_permission" "equipments_tag_numbers_lambda_permission" {
  statement_id  = "LIST_EQUIPMENT_TAG_NUMBERS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.LIST_EQUIPMENT_TAG_NUMBERS}"
}

resource "aws_lambda_permission" "equipment_log_report_pdf_permission" {
  statement_id  = "LOG_REPORT_PDF"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.LOG_REPORT_PDF}"
}

resource "aws_lambda_permission" "clone_equipment_lambda_permission" {
  statement_id  = "CLONE_EQUIPMENT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.CLONE_EQUIPMENT}"
}

resource "aws_lambda_permission" "export_equipments_lambda_permission" {
  statement_id  = "EXPORT_EQUIPMENTS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.EXPORT_EQUIPMENTS}"
}

resource "aws_lambda_permission" "delete_equipment_lambda_permission" {
  statement_id  = "DELETE_EQUIPMENT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.equipments.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.EQUIPMENTS.DELETE_EQUIPMENT}"
}


#USERS PERMISSION
resource "aws_lambda_permission" "users_lambda_permission" {
  statement_id  = "USERS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.users.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.GET_USERS}"
}

resource "aws_lambda_permission" "get_user_lambda_permission" {
  statement_id  = "GET_USER"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.users.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.GET_USER}"
}


resource "aws_lambda_permission" "update_profile_lambda_permission" {
  statement_id  = "UPDATE_PROFILE"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.users.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.UPDATE_PROFILE}"
}

resource "aws_lambda_permission" "save_okta_user_lambda_permission" {
  statement_id  = "SAVE_OKTA_USER"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.users.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.SAVE_OKTA_USER}"
}

# resource "aws_lambda_permission" "create_okta_webhook_lambda_permission" {
#   statement_id  = "CREATE_OKTA_WEBHOOK"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.users.function_name
#   principal     = "apigateway.amazonaws.com"

#   source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.CREATE_OKTA_WEBHOOK}"
# }


resource "aws_lambda_permission" "create_okta_webhook_lambda_permission" {
  statement_id  = "CREATE_OKTA_WEBHOOK"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.users.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.USERS.CREATE_OKTA_WEBHOOK}"
}


#TEST PERMISSION
resource "aws_lambda_permission" "get_test_lambda_permission" {
  statement_id  = "GET_TEST"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.test.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.TEST.GET_TEST}"
}

resource "aws_lambda_permission" "post_test_lambda_permission" {
  statement_id  = "POST_TEST"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.test.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*/*"
}

#LOG PERMISSION
resource "aws_lambda_permission" "get_logs_lambda_permission" {
  statement_id  = "GET_LOGS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logs.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.LOG.GET_LOGS}"
}

resource "aws_lambda_permission" "post_log_lambda_permission" {
  statement_id  = "SAVE_LOG"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logs.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.LOG.SAVE_LOG}"
}

#AWS Q PERMISSION
resource "aws_lambda_permission" "get_aws_q_lambda_permission" {
  statement_id  = "GET_CHAT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_aws_q.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.AWS_Q.GET_CHAT}"
}

#CRYSTALLIZATION PERMISSION
resource "aws_lambda_permission" "crystallization_lambda_permission" {
  statement_id  = "CRYSTALLIZATION_MODEL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.crystallization.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.CRYSTALLIZATION_MODEL}"
}

#CRYSTALLIZATION TOOL PERMISSION
resource "aws_lambda_permission" "crystallization_tool_lambda_permission" {
  statement_id  = "CRYSTALLIZATION_TOOL"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.crystallization_tool.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.SIMULATIONS.CRYSTALLIZATION_TOOL}"
}

#MATERIAL CHAINS PERMISSION
resource "aws_lambda_permission" "get_material_chains_lambda_permission" {
  statement_id  = "GET_MATERIAL_CHAINS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.material_chains.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL_CHAINS.GET}"
}

resource "aws_lambda_permission" "generate_material_chains_lambda_permission" {
  statement_id  = "GENERATE_MATERIAL_CHAINS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.material_chains.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL_CHAINS.GENERATE}"
}

resource "aws_lambda_permission" "save_material_chains_lambda_permission" {
  statement_id  = "SAVE_MATERIAL_CHAINS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.material_chains.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL_CHAINS.SAVE}"
}

resource "aws_lambda_permission" "update_material_chains_lambda_permission" {
  statement_id  = "UPDATE_MATERIAL_CHAINS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.material_chains.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:us-east-1:${local.account_id}:${aws_apigatewayv2_api.marcos_api.id}/*/*${var.paths.MATERIAL_CHAINS.UPDATE}"
}






