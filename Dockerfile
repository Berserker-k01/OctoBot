# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
# gcc and python3-dev might be needed for some python packages
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt full_requirements.txt /app/

# Install any needed packages specified in requirements.txt and full_requirements.txt
# We install full dependencies first to ensure extras (like psutil) are installed
RUN pip install --no-cache-dir -r full_requirements.txt -r requirements.txt

# Copy the rest of the application code
COPY . /app

# Expose the port the app runs on
EXPOSE 5001

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run start.py when the container launches
CMD ["python", "start.py"]
