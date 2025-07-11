# Etap 1: Budowanie aplikacji z Maven i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app/Backend

# Kopiujemy cały folder Backend do obrazu
COPY Backend /app/Backend

# Debug: Sprawdzamy wersję JDK i kompilatora
RUN java -version
RUN javac -version

# Budujemy aplikację, pomijając testy
RUN mvn clean package -DskipTests

# Etap 2: Uruchomienie aplikacji na obrazie z JRE 21
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiujemy JAR z etapu builder
COPY --from=builder /app/Backend/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

# Otwieramy port 8080
EXPOSE 8080

# Uruchamiamy aplikację
ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
