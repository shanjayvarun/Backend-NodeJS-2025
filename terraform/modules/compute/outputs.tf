output "ec2_public_ip" {
  value = aws_instance.crms_server.public_ip
}