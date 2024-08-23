terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

locals {
  lambda_function_runtime            = "python3.10"
  lambda_function_timeout_in_seconds = 300
  lambda_function_source_dir         = "${path.module}/../backend"

}

locals {
  create_auth_trigger_name                = "createAuthChallengeTrigger"
  create_auth_trigger_filename            = "createAuthChallengeLambda.py"
  create_auth_trigger_source_file         = "${local.lambda_function_source_dir}/createAuthChallengeLambda.py"
  define_auth_trigger_name                = "defineAuthChallengeTrigger"
  define_auth_trigger_filename            = "defineAuthChallengeLambda.py"
  define_auth_trigger_source_file         = "${local.lambda_function_source_dir}/defineAuthChallengeLambda.py"
  verify_auth_trigger_name                = "verifyAuthChallengeTrigger"
  verify_auth_trigger_filename            = "verifyAuthChallengeLambda.py"
  verify_auth_trigger_source_file         = "${local.lambda_function_source_dir}/verifyAuthChallengeLambda.py"
  pre_signup_trigger_name                 = "preSignupTrigger"
  pre_signup_trigger_filename             = "preSignupLambda.py"
  pre_signup_trigger_source_file          = "${local.lambda_function_source_dir}/preSignupLambda.py"
  signup_post_confirm_trigger_name        = "signupPostConfirmTrigger"
  signup_post_confirm_trigger_filename    = "signUpPostConfirmationLambda.py"
  signup_post_confirm_trigger_source_file = "${local.lambda_function_source_dir}/signUpPostConfirmationLambda.py"
  post_auth_trigger_name                  = "postAuthChallengeTrigger"
  post_auth_trigger_filename              = "signInPostAuthenticationLambda.py"
  post_auth_trigger_source_file           = "${local.lambda_function_source_dir}/signInPostAuthenticationLambda.py"
  fetch_all_users_lambda_name             = "fetchAllUsers"
  fetch_all_users_lambda_filename         = "fetchAllUsers.py"
  fetch_all_users_lambda_source_file      = "${local.lambda_function_source_dir}/fetchAllUsers.py"
}

# Cognito lambda triggers permissions issue - https://github.com/hashicorp/terraform-provider-aws/issues/8373
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  current_account = data.aws_caller_identity.current.account_id
  current_region  = data.aws_region.current.name
}

data "aws_iam_role" "LabRole" {
  name = "LabRole"
}

resource "aws_lambda_permission" "create_auth_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_auth.function_name
  principal     = "cognito-idp.amazonaws.com"
  # https://github.com/hashicorp/terraform-provider-aws/issues/8373
  source_arn = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on = [aws_lambda_function.create_auth]
}

data "archive_file" "create_auth_zip" {
  source_file = local.create_auth_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.create_auth_trigger_name}.zip"
}

resource "aws_lambda_function" "create_auth" {
  function_name = local.create_auth_trigger_name
  handler       = "createAuthChallengeLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.create_auth_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

# Define Auth Challenge Lambda Trigger 
resource "aws_lambda_permission" "define_auth_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.define_auth.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on    = [aws_lambda_function.define_auth]
}

data "archive_file" "define_auth_zip" {
  source_file = local.define_auth_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.define_auth_trigger_name}.zip"
}

resource "aws_lambda_function" "define_auth" {
  function_name = local.define_auth_trigger_name
  handler       = "defineAuthChallengeLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.define_auth_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

# Verify Auth Challenge Lambda Trigger
resource "aws_lambda_permission" "verify_auth_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.verify_auth.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on    = [aws_lambda_function.verify_auth]
}

data "archive_file" "verify_auth_zip" {
  source_file = local.verify_auth_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.verify_auth_trigger_name}.zip"
}

resource "aws_lambda_function" "verify_auth" {
  function_name = local.verify_auth_trigger_name
  handler       = "verifyAuthChallengeLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.verify_auth_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

# Pre Signup Lambda Trigger
resource "aws_lambda_permission" "pre_signup_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_signup.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on    = [aws_lambda_function.pre_signup]
}

data "archive_file" "pre_signup_zip" {
  source_file = local.pre_signup_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.pre_signup_trigger_name}.zip"
}

resource "aws_lambda_function" "pre_signup" {
  function_name = local.pre_signup_trigger_name
  handler       = "preSignupLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.pre_signup_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

# Signup Post Confirmation Lambda Trigger
resource "aws_lambda_permission" "signup_post_confirm_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.signup_post_confirm.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on    = [aws_lambda_function.signup_post_confirm]
}

data "archive_file" "signup_post_confirm_zip" {
  source_file = local.signup_post_confirm_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.signup_post_confirm_trigger_name}.zip"
}

resource "aws_lambda_function" "signup_post_confirm" {
  function_name = local.signup_post_confirm_trigger_name
  handler       = "signUpPostConfirmationLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.signup_post_confirm_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

# Post Authentication Lambda Trigger
resource "aws_lambda_permission" "post_auth_cognito_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_auth.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = "arn:aws:cognito-idp:${local.current_region}:${local.current_account}:userpool/*"
  depends_on    = [aws_lambda_function.post_auth]
}

data "archive_file" "post_auth_zip" {
  source_file = local.post_auth_trigger_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.post_auth_trigger_name}.zip"
}

resource "aws_lambda_function" "post_auth" {
  function_name = local.post_auth_trigger_name
  handler       = "signInPostAuthenticationLambda.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.post_auth_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "csci5410_project_user_pool_2"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  lambda_config {
    create_auth_challenge          = aws_lambda_function.create_auth.arn
    define_auth_challenge          = aws_lambda_function.define_auth.arn
    verify_auth_challenge_response = aws_lambda_function.verify_auth.arn
    pre_sign_up                    = aws_lambda_function.pre_signup.arn
    post_confirmation              = aws_lambda_function.signup_post_confirm.arn
    post_authentication            = aws_lambda_function.post_auth.arn
  }

  # User pool attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    mutable             = false
    required            = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    mutable             = false
    required            = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    mutable             = false
    required            = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "caesar_cipher_key"
    attribute_data_type = "Number"
    mutable             = true
    number_attribute_constraints {
      min_value = 0
      max_value = 26
    }
  }

  schema {
    name                = "sec_question"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "sec_question_answer"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "user_type"
    attribute_data_type = "String"
    mutable             = false
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  username_attributes = ["email"]
  username_configuration {
    case_sensitive = true
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client_1" {
  name = "react_frontend"

  user_pool_id = aws_cognito_user_pool.user_pool.id
  explicit_auth_flows = [
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  prevent_user_existence_errors = "ENABLED"
}

# Add a users table in DynamoDB
resource "aws_dynamodb_table" "user_table" {
  name           = "users"
  hash_key       = "id"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "id"
    type = "S"
  }
}

data "archive_file" "fetch_all_users_lambda_zip" {
  source_file = local.fetch_all_users_lambda_source_file
  type        = "zip"
  output_path = "${local.lambda_function_source_dir}/${local.fetch_all_users_lambda_name}.zip"
}

resource "aws_lambda_function" "fetch_all_users" {
  function_name = local.fetch_all_users_lambda_name
  handler       = "fetchAllUsers.lambda_handler"
  runtime       = local.lambda_function_runtime
  timeout       = local.lambda_function_timeout_in_seconds

  filename = data.archive_file.fetch_all_users_lambda_zip.output_path

  role = data.aws_iam_role.LabRole.arn
}

resource "aws_lambda_function_url" "fetch_all_users_api" {
  function_name      = aws_lambda_function.fetch_all_users.function_name
  authorization_type = "NONE"
  cors {
    allow_origins = ["*"]
  }
}


output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client_1.id
}

output "fetch_all_users_lambda_endpoint" {
  value = aws_lambda_function_url.fetch_all_users_api.function_url
}