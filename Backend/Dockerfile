# Etap 1: Budowanie aplikacji
# Używamy oficjalnego obrazu Maven + Java 21 (Temurin)
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Katalog roboczy
WORKDIR /app

# Kopiujemy plik pom.xml (dla buforowania zależności)
COPY pom.xml .

# Pobieramy zależności (tryb offline)
RUN mvn dependency:go-offline -B

# Kopiujemy kod źródłowy
COPY src ./src

# Budujemy aplikację bez testów i nadajemy stałą nazwę app.jar
RUN mvn clean package -DskipTests && cp target/*.jar target/app.jar

# Etap 2: Obraz uruchomieniowy
FROM eclipse-temurin:21-jre-alpine

# Katalog roboczy
WORKDIR /app

# Kopiujemy zbudowany plik JAR
COPY --from=builder /app/target/app.jar app.jar

# Otwieramy port aplikacji
EXPOSE 8080

# Komenda startowa aplikacji
ENTRYPOINT ["java", "-jar", "app.jar"]
