resource "aws_s3_bucket" "tf_state" {
  bucket = "crms-tf-state-greta-2026"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "tf_state_lock" {
  name         = "${var.project_name}-tf-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
