# Build stage
FROM golang:1.25-alpine AS builder

# Install git for fetching dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
# -o main matches the command we want to run
# ./cmd/api pointing to the main package
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Run stage
FROM alpine:latest

WORKDIR /root/

# Copy the Pre-built binary from the previous stage
COPY --from=builder /app/main .

# Copy migration files if needed, though we might use a separate migrator
# COPY --from=builder /app/db/migration ./db/migration

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
