resource "aws_ecr_repository" "backend" {
  name = var.ecr_backend_name
  image_tag_mutability = "MUTABLE" # Allows you to overwrite 'latest' tag
  force_delete         = true      # Allows destroying repo even if it has image

  image_scanning_configuration {
      scan_on_push = true
    }

  tags = {
    Terraform = "true"
    Environment = var.environment
    Project = var.project_name
  }
}

resource "aws_ecr_repository" "frontend" {
  name = var.ecr_frontend_name
  image_tag_mutability = "MUTABLE" # Allows you to overwrite 'latest' tag
  force_delete         = true      # Allows destroying repo even if it has image

  image_scanning_configuration {
      scan_on_push = true
    }

  tags = {
    Terraform = "true"
    Environment = var.environment
    Project = var.project_name
  }
}
