# Etap 1: Budowanie aplikacji WAR za pomocą Mavena i JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Katalog roboczy
WORKDIR /app

# Kopiujemy pliki projektu
COPY pom.xml .
COPY src ./src

# Pobieramy zależności i budujemy plik WAR
RUN mvn clean package -DskipTests

# Etap 2: Serwer Tomcat z wdrożonym plikiem WAR
FROM tomcat:9.0-jdk21-temurin

# Usuwamy domyślne aplikacje Tomcata (opcjonalnie)
RUN rm -rf /usr/local/tomcat/webapps/*

# Kopiujemy plik WAR i wdrażamy jako ROOT.war (czyli aplikacja będzie dostępna pod `/`)
COPY --from=builder /app/target/lakicraft-0.0.1.war /usr/local/tomcat/webapps/lakicraft-0.0.1.war

# Otwieramy port 8080
EXPOSE 8080

# Tomcat startuje automatycznie, nie trzeba ustawiać ENTRYPOINT ani CMD
