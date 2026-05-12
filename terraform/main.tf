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

  # Tells Terraform to Store the Sate Remotely in S3 Instead of Local machine
  # backend "s3" {
  #   bucket         = "crms-tf-state-greta-2026"    # S3 bucket storing state file.
  #   key            = "global/s3/terraform.tfstate" # path inside the bucket
  #   region         = "us-east-1"                   # region whetehr the bucket exists
  #   dynamodb_table = "CRMS-tf-state-lock"          # enables state locking. terraform uses this table when apply plan and destroy operations
  #   encrypt        = "true"                        # encrypts terraform state file in s3
  # }
}

# Configures AWS Connection which we Declared Above
provider "aws" {
  # Tells AWS Where the Resources Should be Created ( Currently it Reads from Variables.tf File)
  region = var.aws_region
}

module "compute" {
  source        = "./modules/compute"
  project_name  = var.project_name
  key_name      = var.key_name
  instance_type = var.instance_type
}

