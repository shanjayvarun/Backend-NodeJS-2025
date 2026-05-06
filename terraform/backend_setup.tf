resource "aws_s3_bucket" "tf_state" {
  bucket = "crms-tf-state-greta-2026"
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "tf_state_lock" {
  name         = "CRMS-tf-state-lock"
  # AWS charges only when table is used.
  billing_mode = "PAY_PER_REQUEST" # (or) PROVISIONED - But that requires fixed capacity setup.
  # Primary key of DynamoDB table.
  hash_key     = "LockID" # Terraform uses this key to store lock information.
  attribute {
    # Defines database column.
    name = "LockID" # Column name |  LockID is Stored as text/string
    type = "S" # S - String | N - Number | B - Binary
  }
}
