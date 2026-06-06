# ── Stage 1: Build ──────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom first (better layer caching — dependencies won't re-download on every code change)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: Run ────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/ecobazaarbackend-0.0.1-SNAPSHOT.jar app.jar

# Render sets PORT env var automatically — our app reads ${PORT:8081}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
