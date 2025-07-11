# Etap 1: Budowanie aplikacji JAR za pomocą Mavena i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY Backend /app

# Nadanie uprawnień do wykonywania mvnw
WORKDIR /app
RUN chmod +x Backend/mvnw

# Budowanie
WORKDIR /app/Backend
RUN ./mvnw clean package -DskipTests

# Etap 2: Runtime
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/Backend/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
