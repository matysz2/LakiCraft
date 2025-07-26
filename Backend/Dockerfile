FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Kopiujemy tylko pom.xml i src, jeśli struktura jest standardowa
COPY Backend/pom.xml /app/pom.xml
COPY Backend/src /app/src

# Debug wersji
RUN java -version
RUN javac -version
RUN mvn -version

# Budujemy aplikację bez mvnw
RUN mvn clean package -DskipTests


# Etap uruchamiania
FROM eclipse-temurin:21-jre

WORKDIR /app

# Kopiujemy jar z etapu budowania (zakładając, że jar powstaje w target)
COPY --from=builder /app/target/lakicraft-0.0.1-SNAPSHOT.jar /app/lakicraft.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/lakicraft.jar"]   #jar
