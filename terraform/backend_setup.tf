resource "aws_s3_bucket" "tf_state" {
  bucket = "${var.project_name}_tf_state"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_dynamodb_table" "tf_state_lock" {
  name         = "${var.project_name}_tf_state_lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "Lock ID"
    type = "S"
  }
}
