# LakiCraft – DevOps & Infrastructure Documentation

Dokumentacja techniczna procesu wdrażania, infrastruktury oraz strategii monitoringu projektu **LakiCraft**.

---

# 🛠 Architektura Systemu

LakiCraft został zaprojektowany zgodnie z zasadami **Cloud-Native Architecture**.

Aplikacja została podzielona na niezależne komponenty:

- Backend (Spring Boot)
- Frontend (React / Nginx)
- Warstwa infrastruktury
- System monitoringu

Całość jest **konteneryzowana** oraz zarządzana poprzez **Kubernetes**.

---

## Główne filary infrastruktury

### 🐳 Konteneryzacja

Technologia:

- Docker

Wykorzystane rozwiązania:

- Multi-stage builds
- Minimalizacja rozmiaru obrazów
- Izolacja środowisk
- Bezpieczne obrazy produkcyjne

Przykładowy przepływ:


Kod źródłowy
|
v
Docker Build
|
v
Docker Image
|
v
Container Registry


---

### ☸️ Orkiestracja

Technologia:

- Kubernetes (AKS / GKE)

Odpowiedzialności Kubernetes:

- zarządzanie kontenerami
- automatyczne skalowanie
- self-healing
- rolling updates
- service discovery
- load balancing

---

### 🏗 Infrastructure as Code (IaC)

Technologia:

- Terraform

Infrastruktura jest definiowana jako kod.

Korzyści:

- powtarzalne wdrożenia
- wersjonowanie zmian
- automatyzacja tworzenia środowisk
- łatwe odtwarzanie infrastruktury

---

### 🔄 CI/CD

Technologia:

- GitHub Actions

Pipeline automatyzuje:

- testowanie
- budowanie aplikacji
- tworzenie obrazów Docker
- publikowanie obrazów
- wdrażanie do Kubernetes

---

### 📈 Observability

Stack monitoringu:

- Prometheus
- Grafana
- Spring Boot Actuator

Monitorowane elementy:

- aplikacja Spring Boot
- JVM
- API
- Kubernetes
- zasoby infrastruktury

---

# 🚀 Automatyzacja i Wdrożenie

## 1. Zarządzanie Infrastrukturą (Terraform)

Całe środowisko chmurowe jest definiowane poprzez pliki Terraform.

Struktura:


terraform/
├── main.tf
├── variables.tf
├── outputs.tf
└── providers.tf


---

## Uruchomienie infrastruktury

Przejście do katalogu Terraform:

```bash
cd terraform

Inicjalizacja środowiska:

terraform init

Sprawdzenie planowanych zmian:

terraform plan

Wdrożenie infrastruktury:

terraform apply

Usunięcie infrastruktury:

terraform destroy
2. CI/CD – GitHub Actions

Każdy push do gałęzi:

main

uruchamia automatyczny pipeline.

Pipeline składa się z etapów:
✅ Test

Automatyczne uruchomienie testów:

JUnit
Mockito

Przykład:

mvn test
🏗 Build

Budowanie aplikacji:

Backend:

mvn package

Frontend:

npm run build
🐳 Docker Build

Tworzenie obrazów:

Backend:

docker build -t lakicraft-backend .

Frontend:

docker build -t lakicraft-frontend .
📦 Push do Registry

Obrazy są publikowane do:

Azure Container Registry
Google Artifact Registry
🚢 Deploy Kubernetes

Aktualizacja klastra:

kubectl apply -f k8s/

Strategia wdrożenia:

Rolling Update

Zapewnia:

brak przerw w działaniu aplikacji
stopniową wymianę podów
możliwość rollbacku
📊 Monitoring i Observability

Monitoring realizowany jest poprzez:

Prometheus + Grafana Stack
Spring Boot Monitoring

Źródło danych:

Spring Boot Actuator

Monitorowane metryki:

JVM memory
Garbage Collector
Threads
HTTP Requests
Response Time
Error Rate

Dashboard:

Grafana Dashboard ID: 4701
Kubernetes Monitoring

Monitorowane zasoby:

CPU
RAM
Network
Pod status
Node health

Dashboard:

Grafana Dashboard ID: 6417
Alerting

Grafana posiada skonfigurowany system alertów.

Powiadomienia:

Email SMTP

Przykładowe alerty:

aplikacja niedostępna
wysokie zużycie CPU
brak odpowiedzi API
restart kontenera
📁 Struktura projektu DevOps
LakiCraft
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── secrets.yaml
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
├── Backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
└── docker-compose.yml
🔐 Security

Zastosowane praktyki:

Secrets przechowywane poza repozytorium
zmienne środowiskowe
ograniczone uprawnienia kontenerów
minimalne obrazy Docker
kontrola dostępu Kubernetes RBAC
🌍 Środowiska

Projekt posiada rozdzielone środowiska:

Development
      |
      v
Testing
      |
      v
Production

Każde środowisko posiada własną konfigurację.

Podsumowanie

Infrastruktura LakiCraft wykorzystuje nowoczesne podejście DevOps:

Obszar	Technologia
Kontenery	Docker
Orkiestracja	Kubernetes
IaC	Terraform
CI/CD	GitHub Actions
Monitoring	Prometheus + Grafana
Backend Metrics	Spring Boot Actuator

Architektura zapewnia:

skalowalność
automatyzację
wysoką dostępność
łatwe wdrażanie zmian
obserwowalność systemu