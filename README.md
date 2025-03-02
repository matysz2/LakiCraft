# LakiCraft

LakiCraft to platforma łącząca stolarzy, sprzedawców lakierów oraz lakierników. Projekt został stworzony w technologii **React + Vite** na frontendzie oraz **Spring Boot** na backendzie, z wykorzystaniem **MySQL** do przechowywania danych.

## 📌 Funkcjonalności
- **Panel sprzedawcy** – dodawanie i zarządzanie lakierami oraz zamówieniami.
- **Panel lakiernika** – wyświetlanie zleceń lakierowania, wybór lakieru i zarządzanie statusami.
- **Panel stolarza** – wyszukiwanie lakierników i lakierów, składanie zamówień.
- **Historia wiadomości** – komunikacja między użytkownikami w kontekście zamówień.
- **Obsługa zamówień** – podział na statusy: "W realizacji", "Zrealizowano", "Anulowano".
- **System logowania i autoryzacji** – sprawdzanie użytkownika przez `localStorage`.
- **Ekran ładowania** – animowany pasek postępu przed wejściem na stronę.

## 🛠 Technologie
### Frontend:
- React + Vite
- SASS (SCSS) – oddzielne pliki dla każdego komponentu
- React Router – nawigacja między stronami

### Backend:
- Spring Boot
- MySQL – relacyjna baza danych
- Spring Security – autoryzacja użytkowników
- JPA (Hibernate) – obsługa encji i relacji



## 🔧 Instalacja i uruchomienie
### Backend (Spring Boot)
```sh
cd backend
mvn spring-boot:run
```

### Frontend (React + Vite)
```sh
cd frontend
npm install
npm run dev
```

## 📌 Autor
Projekt został stworzony na potrzeby firmy zajmującej się sprzedażą lakierów i usług stolarskich. Jeśli masz pytania lub chcesz współtworzyć projekt, skontaktuj się!

---
✨ LakiCraft – Twój świat lakierów i stolarstwa! ✨

