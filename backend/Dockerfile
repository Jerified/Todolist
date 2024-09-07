# Start from the official Go image for building the application
FROM golang:1.23-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files into the container
COPY . .  

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN go build -o ./todoapi

# Start a new stage from scratch
FROM alpine:latest

WORKDIR /root

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/todoapi ./todoapi

# Copy the .env file
COPY .env .

# Command to run the executable
CMD ["/root/todoapi"]
