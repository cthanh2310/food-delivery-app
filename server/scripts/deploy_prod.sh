#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Ensure PORT is set
export PORT=${PORT:-3001}

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

# Switch to production for runtime
export NODE_ENV=production

echo "Running migrations..."
npx prisma migrate deploy

echo "Reloading application with PM2..."
# Use pm2 start or reload based on ecosystem file
if pm2 describe food-delivery-be > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js
else
    pm2 start ecosystem.config.js
fi

echo "Saving PM2 configuration..."
pm2 save

echo "Deployment complete! Application is running on port $PORT"
