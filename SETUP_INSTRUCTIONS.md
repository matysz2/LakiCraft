# 📋 LakiCraft - Complete Setup Instructions

## 🎯 Project Overview

**LakiCraft** is a full-stack application with:
- **Backend**: Spring Boot 3.2.5 (Java 21)
- **Frontend**: React 18 with Vite
- **Database**: PostgreSQL 15
- **Deployment**: Render, GitHub Actions CI/CD
- **Testing**: Comprehensive unit & integration tests

---

## 🚀 Quick Start (5 minutes)

### Option 1: Using Docker Compose (Recommended)

```bash
# 1. Clone repository (if not already done)
git clone <your-repo>
cd LakiCraft

# 2. Build and run all services
docker-compose up --build

# 3. Access applications
- Frontend: http://localhost
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432
```

### Option 2: Local Development

#### Backend Setup
```bash
cd Backend

# 1. Install dependencies (Maven does this automatically)
mvn clean install

# 2. Set environment variables
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=railway
export PGUSER=root
export PGPASSWORD=qzmLsevRkjVJKXzgAYlalCosmmrkxUWm

# 3. Run tests
mvn clean verify

# 4. Start application
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

#### Frontend Setup
```bash
cd Frontend

# 1. Install dependencies
npm ci

# 2. Run tests
npm test

# 3. Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Testing

### Run All Tests

```bash
# Backend - all tests
cd Backend
mvn clean verify

# Frontend - all tests
cd Frontend
npm test

# Frontend tests with UI
npm run test:ui

# Both with coverage
cd Backend && mvn jacoco:report
cd Frontend && npm run test:coverage
```

### View Coverage Reports

```bash
# Backend coverage
open Backend/target/site/jacoco/index.html

# Frontend coverage
open Frontend/coverage/index.html
```

---

## 🔧 CI/CD Pipeline Setup

### 1. Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/srv-xxxxx
RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/srv-xxxxx
```

Get these URLs from your Render dashboard:
1. Go to your service settings
2. Find "Deploy Hook" section
3. Copy the URL

### 2. GitHub Actions Workflows

Workflows run automatically:

| Workflow | Trigger | Action |
|----------|---------|--------|
| **CI** | Push to main/develop, PR | Test & build |
| **Deploy** | Push to main | Deploy to Render |
| **Dependencies** | Daily 2 AM UTC | Update packages |

**View workflow runs**: GitHub repo → Actions tab

---

## 📦 Build & Deploy

### Local Build

#### Backend
```bash
cd Backend
mvn clean package -DskipTests
# JAR created: target/lakicraft-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd Frontend
npm run build
# Build created: dist/
```

### Deploy to Render

#### Option 1: Automatic (Recommended)
1. Make changes in feature branch
2. Create Pull Request
3. GitHub Actions CI runs tests
4. After approval, merge to main
5. GitHub Actions Deploy runs automatically

#### Option 2: Manual Deployment
1. On Render dashboard, click "Manual Deploy"
2. Or trigger from GitHub Actions UI

---

## 📊 Project Structure

```
LakiCraft/
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
│       ├── ci.yml          # Test & build
│       ├── deploy.yml      # Deploy to Render
│       └── dependencies.yml # Auto-update packages
├── Backend/                 # Spring Boot Application
│   ├── src/
│   │   ├── main/java/      # Source code
│   │   └── test/java/      # Tests (23+ test methods)
│   ├── pom.xml             # Maven configuration
│   ├── Dockerfile          # Backend container
│   └── .dockerignore
├── Frontend/                # React Application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── __tests__/      # Tests (21+ test methods)
│   │   └── styles/         # SCSS files
│   ├── package.json        # npm configuration
│   ├── vitest.config.js    # Test configuration
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx configuration
│   └── .dockerignore
├── docker-compose.yml       # Local development setup
├── TESTING_GUIDE.md        # Testing documentation
├── CI_CD_DEPLOYMENT.md     # CI/CD setup guide
└── QUICK_COMMANDS.md       # Command reference
```

---

## 🗂️ Created Test Files

### Backend Tests (34 test methods)
- `UserServiceTest.java` - 7 unit tests
- `PasswordServiceTest.java` - 5 unit tests
- `ProductTest.java` - 11 unit tests
- `UserControllerIT.java` - 4 integration tests
- `ProductControllerIT.java` - 7 integration tests

### Frontend Tests (21 test methods)
- `Header.test.jsx` - 4 component tests
- `Footer.test.jsx` - 5 component tests
- `LoadingScreen.test.jsx` - 4 component tests
- `Cart.test.jsx` - 8 component tests
- `testUtils.js` - Mock utilities

---

## 🔐 Environment Variables

### Backend (Backend/.env)
```env
PORT=8080
PGHOST=localhost
PGPORT=5432
PGDATABASE=railway
PGUSER=root
PGPASSWORD=qzmLsevRkjVJKXzgAYlalCosmmrkxUWm
MAIL_USERNAME=your-email@wp.pl
MAIL_PASSWORD=your-password
```

### Frontend (Frontend/.env.local)
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=LakiCraft
```

---

## 📚 Documentation Files Created

1. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**
   - Complete testing guide
   - How to run tests
   - Writing new tests
   - Best practices

2. **[CI_CD_DEPLOYMENT.md](./CI_CD_DEPLOYMENT.md)**
   - CI/CD pipeline setup
   - Manual deployment
   - Monitoring & analytics
   - Troubleshooting

3. **[QUICK_COMMANDS.md](./QUICK_COMMANDS.md)**
   - Common commands reference
   - Git workflow
   - Docker commands
   - Troubleshooting

---

## ✅ Testing Coverage

### Backend
- **Unit Tests**: 23 methods covering services and models
- **Integration Tests**: 11 methods covering API endpoints
- **Coverage Goal**: 80% for services

### Frontend
- **Component Tests**: 21 methods covering key components
- **Test Utilities**: Mock factories for data generation
- **Coverage Goal**: 70% for components

### Coverage Reports
```bash
# Generate reports
mvn jacoco:report  # Backend
npm run test:coverage  # Frontend

# View reports
open Backend/target/site/jacoco/index.html
open Frontend/coverage/index.html
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Tests fail with connection error
```bash
# Solution: Make sure PostgreSQL is running
docker-compose up postgres
# Or check your database credentials in application-test.properties
```

**Issue**: Maven build fails
```bash
# Solution: Clean cache and reinstall
mvn clean install -U
```

**Issue**: Java version mismatch
```bash
# Solution: Ensure Java 21 is installed
java -version  # Should show Java 21
```

### Frontend Issues

**Issue**: npm install fails
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Vite dev server won't start
```bash
# Solution: Port already in use
lsof -i :5173
kill -9 <PID>
```

### Docker Issues

**Issue**: Docker build fails
```bash
# Solution: Remove old images and rebuild
docker-compose down
docker-compose up --build
```

---

## 🔄 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/my-feature
```

### 2. Make Changes
```bash
# Edit files...
```

### 3. Test Locally
```bash
cd Backend && mvn clean verify
cd Frontend && npm test
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add my feature"
```

### 5. Push & Create PR
```bash
git push origin feature/my-feature
# Create Pull Request on GitHub
# GitHub Actions CI runs automatically
```

### 6. Merge to Main
```bash
# After approval, merge on GitHub
# GitHub Actions Deploy runs automatically
```

---

## 📞 Support & Resources

### Documentation
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing guide
- [CI_CD_DEPLOYMENT.md](./CI_CD_DEPLOYMENT.md) - Deployment guide
- [QUICK_COMMANDS.md](./QUICK_COMMANDS.md) - Commands reference

### External Resources
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [Render Documentation](https://render.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

### Quick Help
```bash
# Run all tests locally
mvn clean verify && npm test

# Build for production
mvn clean package -DskipTests && npm run build

# Start local development
docker-compose up

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🎯 Next Steps

- [ ] Configure SonarQube for code quality analysis
- [ ] Add E2E tests with Cypress/Playwright
- [ ] Setup performance testing
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Configure monitoring dashboard
- [ ] Setup pre-commit hooks
- [ ] Add GraphQL support (optional)

---

## ✨ Summary

You now have:
- ✅ **34+ Backend Tests** (unit & integration)
- ✅ **21+ Frontend Tests** (component tests)
- ✅ **CI Pipeline** (automatic on push)
- ✅ **CD Pipeline** (automatic deployment)
- ✅ **Docker Setup** (compose file)
- ✅ **Complete Documentation** (3 guides)
- ✅ **Code Quality Tools** (ESLint, Prettier, coverage)

**Ready to start development!** 🚀

---

**Setup Date**: 20 maja 2026
**Version**: 1.0
**Status**: ✅ Complete
