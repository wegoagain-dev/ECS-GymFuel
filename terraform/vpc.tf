module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1.0"

  name = var.project_name
  cidr = var.vpc_cidr

  azs              = var.azs
  public_subnets   = var.public_subnets
  private_subnets  = var.private_subnets  # gets given NAT gateway
  database_subnets = var.database_subnets # completely isoaltes

  # NAT Gateway (One for dev/portfolio to save money)
  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform   = "true"
    Environment = var.environment
    Project     = var.project_name
  }
}
