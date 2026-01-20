# Security Group
resource "aws_security_group" "alb_sg" {
  name        = var.aws_alb_sg_name
  description = "Allow inbound HTTP traffic"
  vpc_id      = module.vpc.vpc_id
  # Inbound: Allow HTTP from ANYWHERE
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound: Allow HTTPS from ANYWHERE
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound: Allow everything
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Terraform = "true"
    Environment = var.environment
    Project = var.project_name
  }
}

resource "aws_lb" "alb" {
  name               = var.aws_alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets

  tags = {
    Terraform = "true"
    Environment = var.environment
    Project = var.project_name
  }
}

# target groups
resource "aws_lb_target_group" "backend" {
  name        = var.target_group_backend
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip" # talk directly to container ip (needed for fargate)
  vpc_id      = module.vpc.vpc_id

  health_check {
    path                = "/health" # my code will need this endpoint to reach this
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "aws_lb_target_group" "frontend" {
  name        = var.target_group_frontend
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip" # talk directly to conatiner ip
  vpc_id      = module.vpc.vpc_id

  health_check {
    path = "/"
  }
}


#listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

 # default_action { # sending to frontend
 #   type             = "forward"
 #   target_group_arn = aws_lb_target_group.frontend.arn
 # }
 default_action {
   type = "redirect"

   redirect {
     port        = "443"
     protocol    = "HTTPS"
     status_code = "HTTP_301"
   }
 }
}
# wont work as its for the http, but its already rerouted
# resource "aws_lb_listener_rule" "api" { # if path is /api
#  listener_arn = aws_lb_listener.http.arn
#  priority = 100 # to run before the default
#
#  action {
#    type = "forward"
#    target_group_arn = aws_lb_target_group.backend.arn
#  }
#
#  condition {
#    path_pattern {
#      values = ["/api/*"]
#    }
#  }
#}

#listener for 443
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = module.acm.acm_certificate_arn # certificate for domain_name
  ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  default_action { # sending to frontend
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "api_https" { # if path is /api
  listener_arn = aws_lb_listener.https.arn
  priority = 100 # to run before the default

  action {
    type = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
