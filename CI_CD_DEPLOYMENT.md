# LakiCraft - CI/CD & Deployment Guide

## 🚀 Quick Start

### 1. Setup GitHub Secrets

Przejdź do repozytorium → Settings → Secrets and variables → Actions

Dodaj sekrety dla deploymentu:

```
RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/srv-xxxx
RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/srv-xxxx
```

### 2. GitHub Actions Workflows

Projekt zawiera 3 główne workflows:

#### ✅ CI Pipeline (`ci.yml`)
- **Trigger**: Push do `main` lub `develop`, PR
- **Tasks**: 
  - Backend: Maven test, build, coverage
  - Frontend: npm test, ESLint, build
  - Upload artifacts i coverage reports

#### 🚀 Deploy Pipeline (`deploy.yml`)
- **Trigger**: Push do `main` (po merge PR)
- **Tasks**:
  - Build Backend JAR
  - Build Frontend assets
  - Deploy do Render webhooks

#### 📦 Dependencies Pipeline (`dependencies.yml`)
- **Trigger**: Codziennie o 2 AM UTC
- **Tasks**:
  - Sprawdzenie aktualizacji Maven
  - Aktualizacja npm pakietów
  - Auto-create PR z zmianami

---

## 📋 Pre-Deployment Checklist

### Backend
```bash
cd Backend

# 1. Uruchom wszystkie testy
mvn clean verify

# 2. Sprawdź pokrycie kodu
mvn jacoco:report
open target/site/jacoco/index.html

# 3. Build produkcyjny
mvn clean package -DskipTests

# 4. Sprawdź velikość JAR
ls -lh target/lakicraft-*.jar
```

### Frontend
```bash
cd Frontend

# 1. Zainstaluj zależności
npm ci

# 2. Uruchom testy
npm run test:coverage

# 3. Sprawdzenie linting
npm run lint

# 4. Build produkcyjny
npm run build

# 5. Sprawdź wielkość bundle
du -sh dist/
```

---

## 🔧 Manual Deployment

### Na Render

#### Backend Deployment

1. **Utwórz nową usługę na Render**
   ```
   Name: lakicraft-backend
   Environment: Docker
   Repository: twój GitHub repo
   Branch: main
   Dockerfile path: Backend/Dockerfile
   ```

2. **Ustaw Environment Variables**
   ```
   PORT=8080
   PGHOST=<twoja-baza>.proxy.rlwy.net
   PGPORT=38871
   PGDATABASE=railway
   PGUSER=root
   PGPASSWORD=<password>
   MAIL_USERNAME=<email>
   MAIL_PASSWORD=<password>
   ```

3. **Wygeneruj Deploy Hook**
   - Settings → Deploy Hook
   - Skopiuj URL do GitHub Secrets

#### Frontend Deployment

1. **Utwórz nową Static Site na Render**
   ```
   Name: lakicraft-frontend
   Repository: twój GitHub repo
   Branch: main
   Build Command: cd Frontend && npm ci && npm run build
   Publish directory: Frontend/dist
   ```

2. **Ustaw Environment Variables**
   ```
   VITE_API_URL=https://twoja-backend-url.onrender.com
   ```

3. **Wygeneruj Deploy Hook**
   - Settings → Deploy Hook
   - Skopiuj URL do GitHub Secrets

---

## 🔍 Monitoring Deployments

### GitHub Actions

1. Przejdź do repozytorium
2. Kliknij "Actions" tab
3. Sprawdź workflow runs
4. Kliknij na run aby zobaczyć logi

### Render Dashboard

1. Zaloguj się na Render
2. Przejdź do swoich usług
3. Sprawdź "Events" tab dla deployment logs
4. Sprawdź "Metrics" dla performance

### Logs

```bash
# Backend logs
curl https://your-backend.onrender.com/actuator/health

# Frontend - sprawdź browser console
# lub użyj Render dashboard
```

---

## 🐛 Troubleshooting

### CI Pipeline Fails

**Backend tests fail:**
```bash
# Sprawdź Java version
java -version  # Powinna być 21+

# Wyczyszczenie cache
mvn clean

# Uruchom testy z verbose output
mvn test -X
```

**Frontend tests fail:**
```bash
# Sprawdź Node version
node -v  # Powinna być 18+

# Przeinstaluj zależności
rm -rf node_modules package-lock.json
npm ci
npm test
```

### Deploy Fails

**JAR file too large:**
```bash
# Sprawdź co zajmuje miejsce
jar tf target/lakicraft-*.jar | wc -l

# Usuń zbędne pliki (logging, docs)
# z pom.xml - add maven-assembly-plugin
```

**Frontend build fails:**
```bash
# Sprawdź czy .env zmienne istnieją
cat Frontend/.env.production

# Sprawdzenie build output
npm run build -- --debug
```

**Render deployment timeout:**
- Zwiększ timeout w Render settings
- Sprawdź czy build process jest zbyt wolny
- Zoptymalizuj dependencies

---

## 📊 Monitoring & Analytics

### Code Coverage

- **Backend**: `Backend/target/site/jacoco/index.html`
- **Frontend**: `Frontend/coverage/index.html`
- **Target**: Min 75% overall coverage

### Performance Metrics

Render provides:
- CPU usage
- Memory usage
- Request count
- Response time
- Error rate

Setup na Render:
1. Settings → Enhanced Metrics (paid feature)
2. lub użyj własnego monitoring solution

### GitHub Actions Insights

- Workflow run times
- Success/failure rates
- Cost analysis (included free)

---

## 🔐 Security

### Secrets Management

```bash
# Nigdy nie commituj .env plików
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Sprawdzaj sekrety w GitHub Actions
# Settings → Secrets & variables → Actions
```

### Dependency Security

```bash
# Backend
cd Backend
mvn dependency-check:check

# Frontend
cd Frontend
npm audit
npm audit fix  # Fix auto-fixable issues
```

### Deployment Security

- ✅ Używaj HTTPS everywhere
- ✅ Setup firewall rules
- ✅ Rotate secrets regularly
- ✅ Use strong passwords
- ✅ Enable 2FA for GitHub

---

## 📝 Best Practices

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request
# GitHub Actions CI runs automatically

# After review/approval, merge to main
# GitHub Actions Deploy runs automatically
```

### Commit Messages

```
feat: add user authentication
fix: resolve login bug
docs: update API documentation
style: format code
refactor: reorganize user service
test: add user service tests
chore: update dependencies
```

### Branch Strategy

```
main (production)
  ├── develop (staging)
  │   ├── feature/user-auth
  │   ├── feature/product-search
  │   └── bugfix/login-issue
  └── hotfix/critical-bug
```

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Maven Documentation](https://maven.apache.org/)
- [npm Documentation](https://docs.npmjs.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)

---

## ❓ FAQ

**Q: Jak często deployment się odbywa?**
A: Automatycznie po każdym merge do `main` brancha.

**Q: Co jeśli deployment failed?**
A: Sprawdź GitHub Actions logi, napraw issues, i push nową wersję.

**Q: Czy mogę deployować ręcznie?**
A: Tak, użyj `workflow_dispatch` button w Actions tab.

**Q: Jak przywrócić poprzednią wersję?**
A: Revert commit i push, lub redeploy stara wersja z Render dashboard.

**Q: Czy mogę deployować na inny serwer?**
A: Tak, dostosuj workflow dla twojej platformy (AWS, Azure, etc).

---

## 📞 Support

Jeśli masz problemy:

1. Sprawdź [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Przeczytaj GitHub Actions logi
3. Sprawdź Render documentation
4. Otwórz GitHub issue w repozytorium

---

**Last Updated**: 20 maja 2026
