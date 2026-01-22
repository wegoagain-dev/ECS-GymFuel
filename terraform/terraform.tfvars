# --- REQUIRED ---
domain_name = "gymfuel.xyz"

# --- OPTIONAL ---
project_name = "ecs-gymfuel"
environment  = "dev"
aws_region   = "eu-west-2"

# Database
db_name           = "gymfuel_db"
db_username       = "gymfuel"
db_instance_class = "db.t3.micro"

# Resources
ecs_cpu    = "256"
ecs_memory = "512"

# VPC (Uncomment to override)
# vpc_cidr = "10.0.0.0/16"
