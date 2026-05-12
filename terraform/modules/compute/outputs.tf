output "instance_ip" {
  value = aws_instance.crms_server.public_ip
}