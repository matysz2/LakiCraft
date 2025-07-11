# Etap 1: Budowanie JAR za pomocą Mavena i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Kopiowanie całego projektu (pom.xml + src + inne potrzebne pliki)
COPY . .

# Kompilacja projektu i tworzenie pliku .jar
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Etap 2: Tworzenie obrazu z gotowym .jar
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Kopiujemy .jar z poprzedniego etapu
COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar app.jar

# Otwieramy port 8080
EXPOSE 8080

# Domyślna komenda do uruchomienia Spring Boota
ENTRYPOINT ["java", "-jar", "app.jar"]
