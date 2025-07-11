# Etap 1: Budowanie aplikacji JAR za pomocą Mavena i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app/Backend

# Kopiujemy tylko folder Backend (z pom.xml i src)
COPY Backend /app/Backend

# Ustawiamy prawa do mvnw jeśli używasz wrappera
RUN chmod +x mvnw

# Budujemy aplikację (pomijamy testy)
RUN ./mvnw clean package -DskipTests

# Etap 2: Wybór obrazu z JDK do uruchomienia JAR
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiujemy z etapu build JAR do kontenera uruchomieniowego
COPY --from=builder /app/Backend/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

# Otwieramy port 8080
EXPOSE 8080

# Uruchamiamy aplikację
ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
