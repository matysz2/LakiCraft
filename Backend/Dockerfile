# Etap 1: Budowanie aplikacji (builder)
# Używamy oficjalnego obrazu Maven, który zawiera już OpenJDK i Maven,
# co eliminuje potrzebę ręcznej instalacji Mavena za pomocą apt-get.
FROM maven:3.9.6-openjdk-21 AS builder

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy plik pom.xml, aby Docker mógł buforować zależności Mavena.
# To przyspiesza budowanie, jeśli tylko kod źródłowy się zmienia.
COPY pom.xml .

# Pobieramy zależności Mavena. -B oznacza tryb batch (nieinteraktywny).
RUN mvn dependency:go-offline -B

# Kopiujemy resztę kodu źródłowego aplikacji
COPY src ./src

# Budujemy aplikację Spring Boot. Pomijamy testy, aby przyspieszyć budowanie obrazu.
# Domyślnie Spring Boot tworzy plik JAR, a nie WAR, jeśli nie ma specjalnej konfiguracji.
# Zmieniamy nazwę pliku wynikowego na app.jar dla uproszczenia.
RUN mvn clean package -DskipTests

# Etap 2: Uruchamianie aplikacji Spring Boot (finalny obraz)
# Używamy lżejszego obrazu JRE (Java Runtime Environment), który zawiera tylko to,
# co jest potrzebne do uruchomienia aplikacji, bez narzędzi deweloperskich (JDK).
# To znacznie zmniejsza rozmiar końcowego obrazu Docker.
FROM openjdk:21-jre-slim

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy zbudowany plik JAR z etapu 'builder' do finalnego obrazu.
# Używamy gwiazdki (*.jar), aby dopasować nazwę pliku JAR, która może zawierać wersję.
# Zapisujemy go jako app.jar.
COPY --from=builder /app/target/*.jar app.jar

# Określamy port, na którym aplikacja nasłuchuje.
# Render.com będzie kierował ruch na ten port.
EXPOSE 8080

# Komenda uruchamiająca aplikację Spring Boot.
# Uruchamiamy plik JAR.
ENTRYPOINT ["java", "-jar", "app.jar"]
