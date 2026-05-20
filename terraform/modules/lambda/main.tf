resource "aws_iam_role" "crms_lambda_role" {
  name = "${var.project_name}-lambda-role-${terraform.workspace}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "crms_lambda_role_attachment" {
  role       = aws_iam_role.crms_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/crms_worker"
  output_path = "${path.module}/crms_worker.zip"
}

resource "aws_lambda_function" "crms_lambda_function" {
  function_name = "${var.project_name}-lambda-function-${terraform.workspace}"
  role          = aws_iam_role.crms_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = data.archive_file.lambda_zip.output_path
}
