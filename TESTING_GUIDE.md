# Testing & CI/CD Guide for LakiCraft

## Przegląd

Projekt LakiCraft zawiera kompletne rozwiązanie do testowania i automatycznego deploymentu (CI/CD):
- **Unit Tests**: Testowanie pojedynczych komponentów
- **Integration Tests**: Testowanie integracji między warstwami
- **E2E Tests**: Opcjonalne testy end-to-end (do dodania)
- **Code Coverage**: Automatyczne raportowanie pokrycia kodu
- **CI Pipeline**: Automatyczne testy na każdy push/PR
- **CD Pipeline**: Automatyczny deployment na production

---

## Backend (Spring Boot)

### Struktura Testów

```
Backend/src/test/
├── java/
│   └── com/example/lakicraft/
│       ├── BaseUnitTest.java              # Klasa bazowa dla unit testów
│       ├── BaseIntegrationTest.java       # Klasa bazowa dla integration testów
│       ├── service/
│       │   ├── UserServiceTest.java       # Unit testy dla UserService
│       │   └── PasswordServiceTest.java   # Unit testy dla PasswordService
│       └── controller/
│           └── UserControllerIT.java      # Integration testy dla kontrolerów
└── resources/
    └── application-test.properties        # Konfiguracja testowej bazy danych
```

### Uruchomienie Testów

#### Unit Tests
```bash
cd Backend
# Uruchom tylko unit testy
mvn clean test -DskipITs

# Uruchom unit testy z pokryciem kodu
mvn clean test jacoco:report
```

#### Integration Tests
```bash
# Uruchom integration testy (wymaga bazy danych)
mvn verify -DskipUnitTests=true

# Uruchom wszystkie testy (unit + integration)
mvn clean verify
```

#### Code Coverage
```bash
# Wygeneruj raport pokrycia kodu
mvn jacoco:report

# Raport będzie dostępny w: Backend/target/site/jacoco/index.html
```

### Zależności Testowe

- **JUnit 5**: Framework do testowania
- **Mockito**: Mockowanie zależności
- **AssertJ**: Fluent assertions
- **TestContainers**: Real database testing
- **REST Assured**: REST API testing

---

## Frontend (React/Vite)

### Struktura Testów

```
Frontend/src/
├── __tests__/
│   ├── setup.js                    # Konfiguracja testów
│   ├── utils/
│   │   └── testUtils.js            # Utility funkcje do testów
│   ├── Header.test.jsx             # Testy dla Header
│   ├── Footer.test.jsx             # Testy dla Footer
│   └── LoadingScreen.test.jsx      # Testy dla LoadingScreen
```

### Uruchomienie Testów

#### Unit Tests
```bash
cd Frontend

# Uruchom wszystkie testy
npm test

# Uruchom testy w watch mode
npm test -- --watch

# Uruchom testy dla konkretnego pliku
npm test Header.test.jsx
```

#### UI Mode (dla debugowania)
```bash
npm run test:ui

# Otworzy interfejs w przeglądarce dla interaktywnego debugowania
```

#### Code Coverage
```bash
npm run test:coverage

# Raport będzie dostępny w: Frontend/coverage/index.html
```

### Zależności Testowe

- **Vitest**: Test runner (alternatywa dla Jest, optymalizowana dla Vite)
- **React Testing Library**: Testowanie React komponentów
- **jsdom**: DOM emulator dla testów Node.js

---

## GitHub Actions Workflows

### CI Workflow (`ci.yml`)

Automatycznie uruchamiany na każdy push i pull request:

```
1. Backend Tests
   - Testowanie jednostkowe
   - Integration testy
   - Budowanie JAR
   - Upload pokrycia kodu

2. Frontend Tests
   - Linting (ESLint)
   - Testowanie jednostkowe
   - Budowanie aplikacji
   - Upload pokrycia kodu

3. Quality Check
   - Opcjonalnie: SonarQube analysis
```

**Trigger**: Push do `main` lub `develop`, PR do `main` lub `develop`

### Deploy Workflow (`deploy.yml`)

Automatycznie uruchamiany po merge do `main`:

```
1. Backend Build & Deploy
   - Budowanie JAR
   - Deploy na Render (webhook)

2. Frontend Build & Deploy
   - Budowanie aplikacji
   - Deploy na Render (webhook)

3. Notify Deployment
   - Weryfikacja statusu deploymentu
```

**Trigger**: Push do `main` (merge PR)

### Dependencies Workflow (`dependencies.yml`)

Automatycznie aktualizuje zależności:

```
- Codziennie o 2 AM UTC
- Sprawdzanie aktualizacji Maven
- Aktualizacja npm pakietów
- Tworzenie PR z zmianami
```

---

## Konfiguracja GitHub Secrets

Aby CI/CD działał poprawnie, ustaw następujące sekrety w GitHub:

### Dla Deploymentu
```
RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/...
RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/...
```

### Dla Railway (opcjonalnie)
```
RAILWAY_TOKEN=<twój token>
```

### Dla CodeCov
```
CODECOV_TOKEN=<twój token>
```

---

## Pisanie Nowych Testów

### Backend - Unit Test Template

```java
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class MyServiceTest extends BaseUnitTest {
    
    @Mock
    private SomeDependency dependency;
    
    private MyService service;
    
    @BeforeEach
    void setUp() {
        service = new MyService(dependency);
    }
    
    @Test
    @DisplayName("Should do something")
    void testSomething() {
        // Arrange
        when(dependency.getData()).thenReturn("data");
        
        // Act
        String result = service.doSomething();
        
        // Assert
        assertThat(result).isEqualTo("expected");
        verify(dependency).getData();
    }
}
```

### Backend - Integration Test Template

```java
class MyControllerIT extends BaseIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @DisplayName("Should return data")
    void testGetData() throws Exception {
        mockMvc.perform(get("/api/data")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

### Frontend - Component Test Template

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
    it('should render component', () => {
        render(<MyComponent />);
        expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
    
    it('should handle user interaction', async () => {
        const user = userEvent.setup();
        render(<MyComponent />);
        
        await user.click(screen.getByRole('button'));
        expect(screen.getByText('Updated Text')).toBeInTheDocument();
    });
});
```

---

## Best Practices

### Backend
- ✅ Testuj logikę biznesową (services)
- ✅ Mockuj zewnętrzne zależności
- ✅ Używaj TestContainers dla rzeczywistej bazy
- ✅ Utrzymuj test properties oddzielnie
- ❌ Nie testuj frameworka Spring (testuj integracje)

### Frontend
- ✅ Testuj użytkownika, nie implementacji
- ✅ Używaj `userEvent` zamiast `fireEvent`
- ✅ Testuj dostępność (a11y)
- ✅ Mockuj API calls
- ❌ Nie testuj bibliotek (React, React Router)

### Oba
- ✅ Pisz jasne, opisowe nazwy testów
- ✅ Używaj AAA Pattern (Arrange, Act, Assert)
- ✅ Utrzymuj kod testów DRY
- ✅ Uruchamiaj testy lokalnie przed push
- ✅ Śledź pokrycie kodu
- ❌ Nie twórz flaky testów

---

## Troubleshooting

### Backend Tests Nie Przechodzą

```bash
# Sprawdź czy Maven cache jest czysta
mvn clean verify

# Sprawdź czy Java 21 jest zainstalowana
java -version

# Sprawdź logi testów
mvn test -X
```

### Frontend Tests Nie Przechodzą

```bash
# Wyczyść node_modules i przeinstaluj
rm -rf node_modules package-lock.json
npm install

# Uruchom testy w debug mode
npm test -- --inspect-brk

# Sprawdź czy Node 18+ jest zainstalowany
node -v
```

### CI Pipeline Fails

1. Sprawdź workflow logs na GitHub Actions
2. Uruchom testy lokalnie z tą samą konfiguracją
3. Sprawdź czy sekrety są poprawnie ustawione
4. Sprawdź czy zależności są zainstalowane

---

## Metryki i Raportowanie

### Code Coverage Goals

- **Backend**: Minimum 80% dla services
- **Frontend**: Minimum 70% dla components
- **Overall**: Minimum 75%

### Pobieranie Raportów

```bash
# Backend coverage
cd Backend
mvn jacoco:report
open target/site/jacoco/index.html

# Frontend coverage
cd Frontend
npm run test:coverage
open coverage/index.html
```

---

## Dalsze Ulepszenia (TODO)

- [ ] E2E testy z Cypress/Playwright
- [ ] Performance testy
- [ ] Mutation testing
- [ ] Contract testing
- [ ] Security scanning (OWASP)
- [ ] Load testing
- [ ] Docker compose dla integration testów
- [ ] Test result dashboard

---

## Przydatne Linki

- [JUnit 5 Documentation](https://junit.org/junit5/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions](https://docs.github.com/en/actions)
