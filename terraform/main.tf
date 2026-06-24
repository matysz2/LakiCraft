terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }
}

provider "kubernetes" {
  config_path = pathexpand("~/.kube/config")
}

# 1. Deployment Backend-u
resource "kubernetes_deployment_v1" "backend" {
  metadata {
    name   = "lakicraft-backend-deployment"
    labels = { app = "lakicraft-backend" }
  }
  spec {
    replicas = 2
    selector {
      match_labels = { app = "lakicraft-backend" }
    }
    template {
      metadata { labels = { app = "lakicraft-backend" } }
      spec {
        container {
          image = "matysz21/lakicraft-backend:latest"
          name  = "backend"
          
          port { container_port = 8080 }

          env {
            name  = "PORT"
            value = "8080"
          }
          env {
            name  = "SPRING_DATASOURCE_URL"
            value = "jdbc:postgresql://postgres:5432/lakicraft_prod"
          }
          env {
            name  = "SPRING_DATASOURCE_USERNAME"
            value = "lakicraft_user"
          }
          env {
            name  = "SPRING_DATASOURCE_PASSWORD"
            value_from {
              secret_key_ref {
                name = "lakicraft-secrets"
                key  = "db-password"
              }
            }
          }
          env {
            name  = "SPRING_DATASOURCE_DRIVER_CLASS_NAME"
            value = "org.postgresql.Driver"
          }
          
          # Konfiguracja Actuatora dla Prometheusa
          env {
            name  = "MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE"
            value = "health,info,prometheus"
          }
          env {
            name  = "MANAGEMENT_ENDPOINT_PROMETHEUS_ENABLED"
            value = "true"
          }
        }
      }
    }
  }
  lifecycle {
    ignore_changes = [
      spec[0].template[0].metadata[0].labels,
      spec[0].replicas
    ]
  }
}

# 2. Service dla Postgresa
resource "kubernetes_service_v1" "postgres_service" {
  metadata {
    name = "postgres"
  }
  spec {
    selector = {
      app = "lakicraft-postgres"
    }
    port {
      port        = 5432
      target_port = 5432
    }
  }
}