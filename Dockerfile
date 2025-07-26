# Etap budowania
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Kopiujemy pliki pom.xml i src z bieżącego kontekstu (czyli Backend/)
COPY pom.xml /app/pom.xml
COPY src /app/src

# Debug wersji (pomocne przy diagnostyce)
RUN java -version
RUN javac -version
RUN mvn -version

# Budujemy aplikację
RUN mvn clean package -DskipTests


# Etap uruchamiania
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiujemy wygenerowany plik JAR z poprzedniego etapu
COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

EXPOSE 8080

# Uruchamiamy aplikację
ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]
