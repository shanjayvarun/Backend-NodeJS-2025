# Special Terraform block used to expose values after terraform apply.
output "prod_instance_ip" {
  description = "The Public IP to put into GitHub Secrets"
  value       = aws_instance.crms_server_tf.public_ip
}

output "s3_bucket_name" {
  description = "Bucket Name of the Terraform State File Stored"
  value = aws_s3_bucket.tf_state.bucket
}

output "tf_state_lock_dynamoDB_name" {
  description = "Dynamo DB Name of the Terraform State file Created"
  value = aws_dynamodb_table.tf_state_lock.name
}
