# ==========================================
# ETAP 1: Budowanie aplikacji (Maven + Java 21)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Ustawienie katalogu roboczego w kontenerze budującym
WORKDIR /app

# Kopiowanie pliku pom.xml oraz pobranie zależności (cache'owanie warstw Dockera)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopiowanie kodu źródłowego aplikacji
COPY src ./src

# Budowanie paczki JAR z pominięciem testów jednostkowych (dla przyspieszenia procesu)
RUN mvn clean package

# ==========================================
# ETAP 2: Obraz uruchomieniowy (Tylko JRE 21)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Kopiowanie skompilowanego pliku JAR z poprzedniego etapu (build)
COPY --from=build /app/target/*.jar app.jar

# Informacja, na jakim porcie domyślnie nasłuchuje aplikacja w kontenerze
EXPOSE 8080

# Uruchomienie aplikacji Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]