# ==============================================================================
# DevOpsPilot Backend Multi-Stage Dockerfile
# Stage 1: Build Spring Boot JAR with Eclipse Temurin JDK 21
# Stage 2: Minimal hardened JRE 21 Alpine runtime image
# ==============================================================================

# --- Stage 1: Build ---
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Upgrade Alpine base packages to resolve known OS-level CVEs
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Add unprivileged user for security
RUN addgroup -S devopspilot && adduser -S devopspilot -G devopspilot
USER devopspilot

COPY --from=builder /build/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
