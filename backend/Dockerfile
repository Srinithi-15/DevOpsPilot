FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add unprivileged user for security
RUN addgroup -S devopspilot && adduser -S devopspilot -G devopspilot
USER devopspilot

COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
