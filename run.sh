#!/bin/bash

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null; then
        return 1
    else
        return 0
    fi
}

# Function to check if a Docker container exists
check_container_exists() {
    local container_name=$1
    if docker ps -a --filter "name=$container_name" --format '{{.Names}}' | grep -q "$container_name"; then
        return 0
    else
        return 1
    fi
}

# Function to check if a Docker image exists
check_image_exists() {
    local image_name=$1
    if docker images --format '{{.Repository}}' | grep -q "$image_name"; then
        return 0
    else
        return 1
    fi
}

# Ask the user for the host port
echo "Please enter the host port you want to use for the application:"
read -r host_port

# Check if the port is available
if check_port "$host_port"; then
    echo "Port $host_port is available."
else
    echo "Port $host_port is already in use. Please choose a different port."
    exit 1
fi

# Check if the Docker image exists
if check_image_exists "e1sports"; then
    echo "Docker image 'e1sports' already exists."
    echo "Do you want to update the image? (yes/no)"
    read -r update_image

    if [ "$update_image" == "yes" ]; then
        echo "Removing existing image 'e1sports'..."
        docker rmi e1sports
    else
        echo "Skipping image update."
    fi
fi

# Build the Docker image
echo "Building the Docker image..."
docker build -t e1sports .

# Check if the Docker container exists
if check_container_exists "e1sports"; then
    echo "Docker container 'e1sports' already exists."
    echo "Do you want to remove the existing container and run a new one? (yes/no)"
    read -r update_container

    if [ "$update_container" == "yes" ]; then
        echo "Stopping and removing existing container 'e1sports'..."
        docker stop e1sports
        docker rm e1sports
    else
        echo "Skipping container update."
    fi
fi

# Run the Docker container
echo "Running the Docker container on port $host_port..."
docker run -d --name e1sports -p "$host_port:3000" e1sports

echo "Docker container is running."
