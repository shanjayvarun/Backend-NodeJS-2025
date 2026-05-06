variable "aws_region" {
  description = "AWS REGION"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "AWS INSTANCE"
  default     = "t3.micro"
}

variable "project_name" {
  description = "PROJECT NAME"
  default     = "CRMS"
}

variable "my_ip" {
  description = "IP ADDRESS WHICH WILL HIT MY INSTANCE"
  default     = "0.0.0.0/0"
}
