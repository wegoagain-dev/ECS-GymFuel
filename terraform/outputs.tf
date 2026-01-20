output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "domain_name" {
  description = "Domain name"
  value       = var.domain_name
}

output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.alb.dns_name
}

output "ecr_backend_url" {
  description = "ECR repository URL for backend"
  value       = aws_ecr_repository.backend.repository_url
}
output "ecr_frontend_url" {
  description = "ECR repository URL for frontend"
  value       = aws_ecr_repository.frontend.repository_url
}
