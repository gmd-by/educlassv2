FROM node:22

# Define build arguments
ARG APP_REPOSITORY_NAME
ARG APP_DIRECTORY
ARG EXPOSE_PORT

# Set default values if not provided
ENV APP_REPOSITORY_NAME=${APP_REPOSITORY_NAME:-elite}

# Copy application source code
COPY ${APP_DIRECTORY} /${APP_REPOSITORY_NAME}

# Set working directory
WORKDIR /${APP_REPOSITORY_NAME}

# Install dependencies
RUN npm install

# Expose the specified port
EXPOSE ${EXPOSE_PORT}