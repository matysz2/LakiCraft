# Quick Commands Reference

## 🚀 Local Development & Testing

### Backend

```bash
cd Backend

# Build project
mvn clean install

# Run all tests
mvn clean verify

# Run only unit tests
mvn clean test -DskipITs

# Run only integration tests
mvn verify -DskipUnitTests=true

# Generate code coverage report
mvn clean test jacoco:report
open target/site/jacoco/index.html

# Run application
mvn spring-boot:run

# Build production JAR
mvn clean package -DskipTests

# Check for dependency updates
mvn versions:display-dependency-updates

# Check for security vulnerabilities
mvn dependency-check:check
```

### Frontend

```bash
cd Frontend

# Install dependencies
npm install
# or
npm ci  # for CI environments

# Run development server
npm run dev

# Run all tests
npm test

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests with coverage
npm run test:coverage
open coverage/index.html

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview

# Check for security vulnerabilities
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix
```

---

## 🔄 Git & GitHub Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create Pull Request on GitHub
# (GitHub Actions CI will run automatically)

# After approval, merge to main
# (GitHub Actions Deploy will run automatically)

# Update local main branch
git checkout main
git pull origin main
```

---

## 📊 Monitoring & Debugging

### Backend Debugging

```bash
# Run with debug output
mvn test -X

# Run specific test
mvn test -Dtest=UserServiceTest

# Run specific test method
mvn test -Dtest=UserServiceTest#testDeleteUser_Success

# Test with custom properties
mvn test -Dtest.spring.profiles.active=test
```

### Frontend Debugging

```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Debug specific test
npm test -- Cart.test.jsx

# Debug with Node inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs

# Check test coverage for specific file
npm run test:coverage -- src/components/Cart.jsx
```

---

## 🐳 Docker & Containerization

```bash
# Build Docker image for backend
cd Backend
docker build -t lakicraft-backend:latest .

# Run Docker container
docker run -p 8080:8080 \
  -e PGHOST=localhost \
  -e PGPORT=5432 \
  -e PGDATABASE=railway \
  -e PGUSER=root \
  -e PGPASSWORD=password \
  lakicraft-backend:latest

# Build Docker image for frontend
cd Frontend
docker build -t lakicraft-frontend:latest .

# Run Docker container
docker run -p 80:80 lakicraft-frontend:latest
```

---

## 🔑 Environment Setup

### Render Deployment Setup

```bash
# Get Render deploy hooks from Render dashboard
# Settings → Deploy Hook → Copy URL

# Store in GitHub Secrets:
# RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/srv-xxx
# RENDER_DEPLOY_HOOK_FRONTEND=https://api.render.com/deploy/srv-xxx

# Verify secrets are set
gh secret list  # if using GitHub CLI
```

### Local Development Setup

```bash
# Backend - Create .env file
cd Backend
cat > .env << EOF
PORT=8080
PGHOST=localhost
PGPORT=5432
PGDATABASE=lakicraft_local
PGUSER=postgres
PGPASSWORD=password
MAIL_USERNAME=your-email@wp.pl
MAIL_PASSWORD=your-password
EOF

# Frontend - Create .env.local file
cd Frontend
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=LakiCraft
EOF
```

---

## 📈 Performance Optimization

### Backend

```bash
# Build optimized JAR
mvn clean package -DskipTests -Pproduction

# Analyze JAR size
jar tf target/lakicraft-*.jar | wc -l

# Check dependencies for conflicts
mvn dependency:tree
```

### Frontend

```bash
# Analyze bundle size
npm run build -- --debug

# Check for unused dependencies
npm list --depth=0

# Remove unused packages
npm prune
```

---

## 🔐 Security Checks

```bash
# Backend - Dependency check
cd Backend
mvn org.owasp:dependency-check-maven:check

# Backend - Find security issues
mvn dependency:purge-local-repository

# Frontend - Audit vulnerabilities
cd Frontend
npm audit

# Frontend - Fix vulnerabilities
npm audit fix --force  # Use with caution
```

---

## 📚 Additional Tools

### Maven Helpful Commands

```bash
# Skip tests during build
mvn clean package -DskipTests

# Skip integration tests only
mvn clean package -DskipITs

# Update dependency versions
mvn versions:use-latest-releases -DgenerateBackupPoms=false

# Display project structure
mvn help:effective-pom

# Run with specific configuration
mvn clean package -Dspring.profiles.active=production
```

### npm Helpful Commands

```bash
# Display npm registry info
npm view package-name

# Check outdated packages
npm outdated

# Update specific package
npm update package-name@latest

# Install specific version
npm install package-name@1.0.0

# Remove package
npm uninstall package-name

# Clear cache
npm cache clean --force
```

---

## 🆘 Troubleshooting Commands

### When CI/CD Fails

```bash
# Backend
cd Backend

# 1. Clean and rebuild
mvn clean

# 2. Update dependencies
mvn dependency:resolve

# 3. Check compiler settings
java -version
mvn -v

# 4. Run tests with verbose output
mvn test -X

# 5. Check if ports are in use
lsof -i :8080  # Check backend port
```

```bash
# Frontend
cd Frontend

# 1. Clear npm cache
npm cache clean --force

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check Node version
node -v
npm -v

# 4. Run tests with debug
npm test -- --debug
```

---

## 📝 Test File Locations

### Backend Tests
- Unit Tests: `Backend/src/test/java/com/example/lakicraft/service/*.java`
- Integration Tests: `Backend/src/test/java/com/example/lakicraft/controller/*IT.java`
- Test Config: `Backend/src/test/resources/application-test.properties`

### Frontend Tests
- Component Tests: `Frontend/src/__tests__/*.test.jsx`
- Test Utils: `Frontend/src/__tests__/utils/testUtils.js`
- Test Config: `Frontend/vitest.config.js`
- Setup File: `Frontend/src/__tests__/setup.js`

---

## 🎯 Common Issues & Solutions

### Issue: Maven build fails with compilation errors
```bash
# Solution
mvn clean compile

# Or check Java version
java -version  # Should be 21+
```

### Issue: npm install fails
```bash
# Solution
npm cache clean --force
npm install

# Or use ci instead of install
npm ci
```

### Issue: Tests timeout
```bash
# Backend - Increase timeout in pom.xml
# Frontend - Increase timeout in vitest.config.js

# Or run specific test
mvn test -Dtest=SpecificTest
npm test -- SpecificTest.test.jsx
```

### Issue: Port already in use
```bash
# Backend port 8080
lsof -i :8080
kill -9 <PID>

# Frontend port 5173 (Vite default)
lsof -i :5173
kill -9 <PID>
```

---

## 📞 Quick Help

For more details, see:
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Complete testing documentation
- [CI_CD_DEPLOYMENT.md](./CI_CD_DEPLOYMENT.md) - CI/CD and deployment guide
- [pom.xml](./Backend/pom.xml) - Backend build configuration
- [package.json](./Frontend/package.json) - Frontend build configuration

---

**Last Updated**: 20 maja 2026
