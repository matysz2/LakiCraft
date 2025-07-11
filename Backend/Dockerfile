FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app
COPY Backend /app
WORKDIR /app

RUN mvn clean install -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
