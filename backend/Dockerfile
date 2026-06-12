# ---- Build stage: compile the Spring Boot jar with Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Cache dependencies first
COPY pom.xml .
RUN mvn -q dependency:go-offline
# Build the application
COPY src ./src
RUN mvn -q clean package -DskipTests

# ---- Run stage: small JRE image that runs the jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Render provides the port via $PORT; app.yml already reads it
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
