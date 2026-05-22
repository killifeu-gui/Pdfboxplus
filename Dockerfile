FROM maven:3.8-openjdk-11-slim as builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ src/
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:11-jre-slim

WORKDIR /app

COPY --from=builder /build/target/pdf-corba-app-1.0.0.jar app.jar

RUN mkdir -p uploads logs

ENV PORT=8080
ENV ENVIRONMENT=prod
ENV JAVA_OPTS="-Xmx512m -Xms256m"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/pdf/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
