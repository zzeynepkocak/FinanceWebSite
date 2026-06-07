# ── Build stage ───────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Önce bağımlılıkları çöz (cache katmanı)
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ── Runtime stage ─────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S finans && adduser -S finans -G finans
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/logs && chown -R finans:finans /app
USER finans

EXPOSE 8081
ENTRYPOINT ["java", \
  "-Dspring.profiles.active=docker", \
  "-Dspring.autoconfigure.exclude=io.opentelemetry.instrumentation.spring.autoconfigure.OpenTelemetryAutoConfiguration,io.opentelemetry.instrumentation.spring.autoconfigure.internal.instrumentation.webmvc.SpringWebMvc6InstrumentationAutoConfiguration", \
  "-jar", "app.jar"]
