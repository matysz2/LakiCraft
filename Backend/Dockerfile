# Etap 1: Budowanie aplikacji JAR za pomocą Mavena i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Katalog roboczy
WORKDIR /app

# Skopiuj cały folder Backend do obrazu
COPY Backend /app

# Nadanie uprawnień do wykonywania mvnw
RUN chmod +x ./mvnw

# Buduj aplikację bez testów
RUN ./mvnw clean package -DskipTests

# Etap 2: Obraz uruchomieniowy z JDK 21
FROM eclipse-temurin:21-jdk

# Katalog roboczy
WORKDIR /app

# Skopiuj zbudowany plik JAR z poprzedniego etapu
COPY --from=builder /app/target/*.jar app.jar

# Ustaw zmienną środowiskową PORT (Railway ją nadpisze automatycznie)
ENV PORT=8080

# Otwórz port 8080
EXPOSE 8080

# Komenda uruchamiająca aplikację
ENTRYPOINT ["java", "-jar", "app.jar"]
