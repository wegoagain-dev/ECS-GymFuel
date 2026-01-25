# create bucket (with same name as the backend s3) first in aws with bucket name, region, versioning, encryption, block public access

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }

  backend "s3" {
    bucket         = "gymfuel-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true
    use_lockfile = true
  }
  #

  required_version = ">= 1.2"
}

provider "aws" {
  region = var.aws_region
}
