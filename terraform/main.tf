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

  # # Tells Terraform to Store the Sate Remotely in S3 Instead of Local machine
  backend "s3" {
    bucket       = "crms-tf-state-files-dont-delete"
    key          = "backend/s3/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}

# Configures AWS Connection which we Declared Above
provider "aws" {
  # Tells AWS Where the Resources Should be Created ( Currently it Reads from Variables.tf File)
  region = var.aws_region
}

module "compute" {
  count         = terraform.workspace == "default" ? 0 : 1
  source        = "./modules/compute"
  project_name  = var.project_name
  key_name      = var.key_name
  instance_type = var.instance_type
}

# module "lambda" {
#   count        = terraform.workspace == "default" ? 0 : 1
#   source       = "./modules/lambda"
#   project_name = var.project_name
# }

