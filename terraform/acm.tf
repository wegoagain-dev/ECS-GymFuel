module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 6.3"
  domain_name = var.domain_name
  zone_id     = data.aws_route53_zone.main.zone_id

  subject_alternative_names = [
      "*.${var.domain_name}"  # this used to support www.
    ]

  wait_for_validation = true
  tags = {
    Terraform   = "true"
    Environment = var.environment
    Project     = var.project_name
  }
}
