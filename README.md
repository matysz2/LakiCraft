# LakiCraft

## Opis projektu
LakiCraft to internetowa aplikacja oparta na React i Spring Boot, łącząca stolarzy, sprzedawców lakierów i lakierników. Umożliwia wyszukiwanie i zakup lakierów, zarządzanie zamówieniami oraz komunikację między użytkownikami. Aplikacja obsługuje system logowania oraz autoryzacji użytkowników.

## Funkcjonalności
### Zarządzanie produktami:
- Sprzedawca może dodawać, edytować i usuwać lakiery.
- Produkty są wyświetlane w przejrzystych kartach z możliwością zakupu.

### Zamówienia:
- Stolarze mogą składać zamówienia na lakiery i zlecać lakierowanie.
- Lakiernicy widzą przypisane zlecenia i mogą zmieniać ich statusy.
- Zamówienia mają statusy: "W realizacji", "Zrealizowano", "Anulowano".

### Komunikacja i historia wiadomości:
- Możliwość wysyłania wiadomości dotyczących zamówień.
- Historia wiadomości dostępna w widoku zamówienia.

### Logowanie i autoryzacja:
- System sprawdza użytkownika przez `localStorage`.
- Brak dostępu dla niezalogowanych użytkowników.

### Dodatkowe funkcje:
- Ekran ładowania przed wejściem na stronę.
- Unikalne pobieranie lakierów dla sprzedawców.
- Historia zamówień lakierów dla lakierników.

## Technologie
### Backend:
- Spring Boot – framework backendowy.
- Spring Security – zarządzanie autoryzacją.
- Spring Data JPA – operacje na bazie danych.
- MySQL – relacyjna baza danych.

### Frontend:
- React + Vite – szybkie i nowoczesne środowisko frontendowe.
- SASS (SCSS) – stylizacja komponentów.
- React Router – zarządzanie trasami.

### Inne:
- Maven – zarządzanie zależnościami backendu.
- npm – zarządzanie zależnościami frontendowymi.

## Instalacja
### Klonowanie repozytorium:
```sh
git clone https://github.com/matysz2/LakiCraft.git
cd LakiCraft
```

### Konfiguracja bazy danych:
- Skonfiguruj połączenie z MySQL w `application.properties`.

### Instalacja zależności:
#### Backend:
```sh
cd backend
mvn install
```
#### Frontend:
```sh
cd frontend
npm install
```

### Uruchomienie aplikacji:
#### Backend:
```sh
mvn spring-boot:run
```
#### Frontend:
```sh
npm run dev
```

## Użytkowanie
1. Zaloguj się do aplikacji.
2. Stolarz może wyszukiwać lakiery i składać zamówienia.
3. Sprzedawca może dodawać produkty i zarządzać zamówieniami.
4. Lakiernik widzi przypisane zlecenia i może zmieniać ich statusy.
5. Użytkownicy mogą komunikować się w ramach zamówień.

## Przyszłe plany
- Dodanie zaawansowanego filtrowania i sortowania produktów.
- Integracja z API dostawców lakierów.
- Rozbudowa systemu powiadomień.

## Wkład
Każdy wkład do projektu jest mile widziany! Możesz zgłaszać problemy i propozycje usprawnień w systemie zgłoszeń GitHub.

## Licencja
Projekt LakiCraft jest objęty licencją MIT. Szczegóły znajdują się w pliku LICENSE.

