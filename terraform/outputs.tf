# Special Terraform block used to expose values after terraform apply.
output "current_instance_ip" {
  value = module.compute.instance_ip
}

output "s3_bucket_name" {
  description = "Bucket Name of the Terraform State File Stored"
  value       = one(aws_s3_bucket.tf_state[*].bucket)
}

output "tf_state_lock_dynamoDB_name" {
  description = "Dynamo DB Name of the Terraform State file Created"
  value       = one(aws_dynamodb_table.tf_state_lock[*].name)
}
