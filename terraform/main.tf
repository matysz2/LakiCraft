# 1. Konfiguracja providera - to łączy Terraform z Twoim klastrem AKS
provider "kubernetes" {
  # Terraform odczyta Twoją aktualną sesję kubectl (z Cloud Shella)
  config_path    = "~/.kube/config" 
}

# 2. Twoje istniejące zasoby
resource "kubernetes_manifest" "backend" {
  manifest = yamldecode(file("${path.module}/../backend.yaml"))
}

resource "kubernetes_manifest" "frontend" {
  manifest = yamldecode(file("${path.module}/../frontend.yaml"))
}

resource "kubernetes_manifest" "postgres" {
  manifest = yamldecode(file("${path.module}/../postgres.yaml"))
}