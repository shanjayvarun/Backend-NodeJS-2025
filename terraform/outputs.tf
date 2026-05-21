# Special Terraform block used to expose values after terraform apply.
output "ec2_public_ip" {
  value = length(module.compute) > 0 ? module.compute[0].ec2_public_ip : null
}

output "s3_bucket_name" {
  description = "Bucket Name of the Terraform State File Stored"
  value       = one(aws_s3_bucket.tf_state[*].bucket)
}
