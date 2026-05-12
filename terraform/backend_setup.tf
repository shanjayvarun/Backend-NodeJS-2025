resource "aws_s3_bucket" "tf_state" {
  count  = terraform.workspace == "default" ? 1 : 0
  bucket = "crms-tf-state-files-dont-delete"
  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_dynamodb_table" "tf_state_lock" {
  count = terraform.workspace == "default" ? 1 : 0
  name  = "crms-tf-state-lock-dont-delete"
  # AWS charges only when table is used.
  billing_mode = "PAY_PER_REQUEST" # (or) PROVISIONED - But that requires fixed capacity setup.
  # Primary key of DynamoDB table.
  hash_key = "LockID" # Terraform uses this key to store lock information.
  attribute {
    # Defines database column.
    name = "LockID" # Column name |  LockID is Stored as text/string
    type = "S"      # S - String | N - Number | B - Binary
  }
}
