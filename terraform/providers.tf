# create bucket first in aws with bucket name, region, versioning, encryption, block public access)

# aws dynamodb create-table \
#  --table-name gymfuel-terraform-lock \
#  --key-schema AttributeName=LockID,KeyType=HASH \
#  --attribute-definitions AttributeName=LockID,AttributeType=S \
#  --billing-mode PAY_PER_REQUEST \
#  --region eu-west-2

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
    dynamodb_table = "gymfuel-terraform-lock"
  }
  #

  required_version = ">= 1.2"
}

provider "aws" {
  region = var.aws_region
}
