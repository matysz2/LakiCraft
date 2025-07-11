FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy plik pom.xml i katalog Backend (z kodem źródłowym)
COPY Backend/pom.xml /app/pom.xml
COPY Backend/src /app/src

# Debug - sprawdzamy wersje JDK i Mavena
RUN java -version
RUN javac -version
RUN mvn -version

# Budujemy aplikację pomijając testy
RUN mvn clean package -DskipTests

# Etap uruchamiania
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiujemy jar z etapu budowania (zakładając, że jar powstaje w target)
COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
