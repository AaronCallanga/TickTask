#!/bin/sh
# Entrypoint script for TickTask Frontend Container
#
# This script:
# 1. Replaces environment variables in nginx config template
# 2. Starts nginx
#
# Required Environment Variables:
#   API_BACKEND_URL - Backend API URL (default: http://app:8080)

set -e

# Default values
API_BACKEND_URL=${API_BACKEND_URL:-http://app:8080}

echo "Starting TickTask Frontend..."
echo "API Backend URL: $API_BACKEND_URL"

# Replace environment variables in nginx config template
# Only substitute our custom variables, not nginx's own $variables
envsubst '${API_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Nginx configuration generated successfully"

# Start nginx
exec nginx -g 'daemon off;'
