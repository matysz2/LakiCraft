FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app/Backend

COPY Backend /app

# Debug - sprawdzamy wersje JDK i Mavena
RUN java -version
RUN javac -version
RUN mvn -version

# Budujemy aplikację pomijając testy - BEZ używania mvnw
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/Backend/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
