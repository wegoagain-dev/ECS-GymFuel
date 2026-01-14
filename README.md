# GymFuel - ECS DevOps Production Project

## Content
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
  - [Application](#application)
  - [DevOps/Infrastructure](#devopsinfrastructure)
- [Architecture Explained](#architecture-explained)
  - [Terraform State Management](#terraform-state-management)
  - [CI/CD Pipelines](#cicd-pipelines)
  - [Security](#security)
  - [Monitoring and Observability](#monitoring-and-observability)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Using Docker Compose](#using-docker-compose)
  - [Terraform Setup](#terraform-setup)
- [Development Roadmap](#development-roadmap)
- [License](#license)
- [Support](#support)

## Overview
GymFuel is a complete full-stack project that demonstrates modern web application development and production ready DevOps practices. This project showcases a Next.js frontend with a FastAPI backend, featuring AI-powered recipe generation, meal planning, grocery tracking, and a coach-client system. This is deployed on AWS ECS with containerised infrastructure.

## Architecture
[]

## Tech Stack

### Application
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- Backend: FastAPI (Python 3.11), PostgreSQL
- State Management: Zustand
- Authentication: JWT with role-based access (client/coach)
- AI Integration: Recipe generation API
- Styling: Glassmorphism design with dark/light theme support

### DevOps/Infrastructure (to update)
- Containerisation: Docker multi-stage builds for optimised image sizes
- Orchestration: AWS ECS (Elastic Container Service) with Fargate
- Container Registry: AWS ECR (Elastic Container Registry)
- Database: AWS RDS PostgreSQL with automated backups
- Networking: AWS VPC with public/private subnets, Application Load Balancer
- Reverse Proxy: Nginx for request routing and static file serving (optional)
- Infrastructure as Code: Docker Compose for local development

## Architecture Explained

### Terraform State Management
- **Remote Backend:** S3 bucket in `eu-west-2` with encryption enabled
- **Benefits:** Centralised state storage, team collaboration, automated backups, cross-environment consistency

### CI/CD Pipelines

### Security

### Monitoring and Observability

---

## Local Development Setup

### Prerequisites
- Docker and Docker Compose

### Using Docker Compose

### Terraform Setup



## Development Roadmap

- [ ] Full AI Recipe Generation - in progress
- [ ] Mobile app (React Native)

## License

Copyright (c) 2026 Tawfiq Rahman. All Rights Reserved.
This project is proprietary and may not be copied, modified, or distributed without written permission.

## Support

For support, email tsdevelops00@gmail.com or open an issue in the repository. Dont be shy to contact me!
