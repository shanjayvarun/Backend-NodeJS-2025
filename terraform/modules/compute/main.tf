# DATA BLOCK: Finds the latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role-${terraform.workspace}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_policy" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-instance-profile-${terraform.workspace}"
  role = aws_iam_role.ec2_role.name
}

resource "aws_vpc" "crms_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.project_name}-vpc-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

resource "aws_internet_gateway" "crms_igw" {
  vpc_id = aws_vpc.crms_vpc.id
  tags = {
    Name        = "${var.project_name}-igw-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

resource "aws_subnet" "crms_subnet" {
  vpc_id                  = aws_vpc.crms_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name        = "${var.project_name}-subnet-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

resource "aws_route_table" "crms_route_table" {
  vpc_id = aws_vpc.crms_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.crms_igw.id
  }
  tags = {
    Name        = "${var.project_name}-route-table-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

resource "aws_route_table_association" "crms_route_table_assoc" {
  subnet_id      = aws_subnet.crms_subnet.id
  route_table_id = aws_route_table.crms_route_table.id
}

resource "aws_security_group" "crms_sg" {
  name        = "${var.project_name}-sg-${terraform.workspace}"
  description = "Security group for CRMS"
  vpc_id      = aws_vpc.crms_vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
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
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "crms_server" {
  ami                         = data.aws_ami.amazon_linux_2023.id # Dynamic AMI!
  instance_type               = var.instance_type
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  subnet_id                   = aws_subnet.crms_subnet.id
  vpc_security_group_ids      = [aws_security_group.crms_sg.id]
  user_data_replace_on_change = true
  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }
  user_data = <<-EOF
              #!/bin/bash
              exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
              dnf update -y
              dnf install -y git docker amazon-cloudwatch-agent
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ec2-user
              mkdir -p /usr/local/lib/docker/cli-plugins/
              curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
              chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

              mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/
              cat << 'JSON' > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
              {
                "agent": {
                  "metrics_collection_interval": 60,
                  "run_as_user": "root"
                },
                "logs": {
                  "logs_collected": {
                    "files": {
                      "collect_list": [
                        {
                          "file_path": "/var/log/user-data.log",
                          "log_group_name": "${var.project_name}-${terraform.workspace}-ec2-user-data",
                          "log_stream_name": "{instance_id}",
                          "retention_in_days": 7
                        },
                        {
                          "file_path": "/var/lib/docker/containers/*/*.log",
                          "log_group_name": "${var.project_name}-${terraform.workspace}-docker",
                          "log_stream_name": "{instance_id}/{filename}",
                          "retention_in_days": 7
                        }
                      ]
                    }
                  }
                }
              }
              JSON
              # Start the CloudWatch agent with our defined parameters
              amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

              EOF

  tags = {
    Name        = "${var.project_name}-server-${terraform.workspace}"
    Environment = terraform.workspace
  }
}
