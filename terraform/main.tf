provider "kubernetes" {
  config_path = "~/.kube/config"
}

# --- Backend ---
resource "kubernetes_manifest" "backend_deployment" {
  manifest = yamldecode(file("${path.module}/../k8s/backend-deployment.yaml"))
}

resource "kubernetes_manifest" "backend_service" {
  manifest = yamldecode(file("${path.module}/../k8s/backend-service.yaml"))
}

# --- Frontend ---
resource "kubernetes_manifest" "frontend_deployment" {
  manifest = yamldecode(file("${path.module}/../k8s/frontend-deployment.yaml"))
}

resource "kubernetes_manifest" "frontend_service" {
  manifest = yamldecode(file("${path.module}/../k8s/frontend-service.yaml"))
}

# --- Postgres ---
resource "kubernetes_manifest" "postgres_deployment" {
  manifest = yamldecode(file("${path.module}/../k8s/postgres-deployment.yaml"))
}

resource "kubernetes_manifest" "postgres_service" {
  manifest = yamldecode(file("${path.module}/../k8s/postgres-service.yaml"))
}