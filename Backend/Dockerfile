# Etap 1: Budowanie aplikacji
# Używamy oficjalnego obrazu Maven + Java 21 (temurin)
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Katalog roboczy
WORKDIR /app

# Kopiujemy plik pom.xml (dla buforowania zależności)
COPY pom.xml .

# Pobieramy zależności (offline build preparation)
RUN mvn dependency:go-offline -B

# Kopiujemy kod źródłowy
COPY src ./src

# Budujemy aplikację bez testów
RUN mvn clean package -DskipTests

# Etap 2: Uruchamianie aplikacji
# Lekki obraz z Java 21 JRE (temurin)
FROM eclipse-temurin:21-jre-alpine

# Katalog roboczy
WORKDIR /app

# Kopiujemy zbudowany plik JAR z buildera
COPY --from=builder /app/target/*.jar app.jar

# Port, na którym działa Spring Boot
EXPOSE 8080

# Uruchomienie aplikacji
ENTRYPOINT ["java", "-jar", "app.jar"]
