# Special Terraform block used to expose values after terraform apply.
output "prod_instance_ip" {
  description = "The Public IP to put into GitHub Secrets"
  value       = aws_instance.crms_server_tf.public_ip
}
