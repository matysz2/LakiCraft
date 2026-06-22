resource "kubernetes_deployment" "backend" {
  metadata {
    name = "lakicraft-backend-deployment"
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
          image = "twoj-repozytorium/lakicraft-backend:latest" # Podaj swój obraz
          name  = "backend"
          
          # TUTAJ ROZWIĄZUJEMY PROBLEM BAZY DANYCH
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
        }
      }
    }
  }
}