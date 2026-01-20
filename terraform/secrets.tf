# Generate a secure random key for Flask/FastAPI, didnt store in secrets manager to save cost
resource "random_password" "backend_secret_key" {
  length  = 32
  special = false
}
