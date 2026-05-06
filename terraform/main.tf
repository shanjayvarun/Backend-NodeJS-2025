# Special Teeraform Block for Terrform Level Settings
terraform {
  # Tells Terraform Which Provider Plugins are Required
  required_providers {
    # Local Provider Name ( Here Ist aws)
    aws = {
      # Where Terraform Should Download AWS Plugins From ( Here Hashicorp )
      source = "hashicorp/aws"
      # Which AWS Version Plugins should be Installed
      version = "~> 5.0"
    }
  }
}

# Configures AWS Connection which we Declared Above
provider "aws" {
  # Tells AWS Where the Resources Should be Created ( Currently it Reads from Variables.tf File)
  region = var.aws_region
}

# Resource are part of AWS. Need Which Resource to be Created ( Now Crete IAM Role)
# aws_iam_role is an AWS Resource type + Terraform Local Reference Name for IAM Role to be Called inside the Form
resource "aws_iam_role" "ec2_role" {
  # Actual AWS IAM Role Name to be Created
  name = "${var.project_name}-ec2-role"
  # Defines Who can us this role ( jsonencode coverts terraform Object into a JSON Object Since AWS expects a JSON Object )
  assume_role_policy = jsonencode({
    # Standard AWS Policy Version
    Version = "2012-10-17",
    # Permission Rules List
    Statement = [{
      # Allows assuming role.
      Action = "sts:AssumeRole"
      # Permission allowed.
      Effect = "Allow"
      # Who can Assume Role
      Principal = {
        # Means EC2 Instances can Use this Role
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

# Attaches AWS managed policy to role.
resource "aws_iam_role_policy_attachment" "ssm_policy" {
  # Which role gets permission.
  role = aws_iam_role.ec2_role.name
  # AWS predefined policy.
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# EC2 cannot directly use IAM role. It needs wrapper = instance profile.
resource "aws_iam_instance_profile" "ec2_profile" {
  # Actual AWS profile name
  name = "${var.project_name}-instance-profile"
  # Which Role Gets Wrapped
  role = aws_iam_role.ec2_role.name
}

# Security Groups ( Acts like firewall. )
resource "aws_security_group" "crms_sg_tf" {
  # Security group name in AWS.
  name        = "${var.project_name}-sg"
  description = "Security group for CRMS Microservices"
  ingress {
    # Port 80 is Web Http Traffic | Port 22 is SSH | Port 443 is 
    from_port = 80
    to_port   = 80
    # Network Protocol ( tcp = web/ssh traffic )
    protocol = "tcp"
    # Allowed IP ranges.  ( everyone on internet )
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Means all protocols.
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Creates virtual server in Amazon Web Services.
resource "aws_instance" "crms_server_tf" {
  # Operating system image
  ami = "ami-0ed094fb1304fd857"
  # Server Size
  instance_type = "t3.micro"
  # SSH Key pair name ( Mainly used for SSH into the Machine)
  key_name = "shanjay-key"
  # Attaches IAM Permissions
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  # Attaches Firewalls Ids
  vpc_security_group_ids = [aws_security_group.crms_sg_tf.id]
  # Runs shell commands during server boot. Like Startup Automation
  user_data = <<EOF
              # Update Packages
              dnf update -y
              # Install Docker + Git
              dnf install -y docker git
              # Start Docker
              systemctl start docker
              # Auto Start Docker on ReBoot
              systemctl enable docker
              # Allows ec2-user to run docker commands.
              usermod -aG docker ec2-user
              # Create folder
              mkdir -p /usr/local/lib/docker/cli-plugins/
              # Download Docker Compose
              curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
              # Make executable
              chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
              # Create Project Folder
              mkdir -p /home/ec2-user/crms-backend
              # Give Ownership
              chown ec2-user:ec2-user /home/ec2-user/crms-backend
              EOF
  # Terraform lifecycle behavior.
  lifecycle {
    # if True Means It Prevents Accidental Deletion False means Deletion Allowed. Very uch Useful for Production DBs
    # If You want to Change or delete the machine means, you need to change this to false , terrform apply and then terraform destroy it
    prevent_destroy = true
  }

  # Metadata labels for AWS Resources
  tags = {
    # Visible name in AWS console. Helps identify server.
    Name = "${var.project_name}-Microservices-Prod"
    # env Type Companies rely Heavily for Complaince, Billing, Filtering, and Automation
    Environment = "Production"
  }

}

