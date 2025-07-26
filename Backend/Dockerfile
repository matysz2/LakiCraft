# Etap budowania
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml /app/pom.xml
COPY src /app/src

RUN java -version
RUN javac -version
RUN mvn -version

RUN mvn clean package -DskipTests


# Etap uruchamiania
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
