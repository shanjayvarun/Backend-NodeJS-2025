resource "aws_s3_bucket" "tf_state" {
  count  = terraform.workspace == "default" ? 1 : 0
  bucket = "crms-tf-state-files-dont-delete"
  lifecycle {
    prevent_destroy = false
  }
}