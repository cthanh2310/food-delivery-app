#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# Find free port using node script
echo "Checking for available port starting from 3000..."
# Ensure PORT is passed if set, else default to 3000 inside script
export PORT=3000
PORT=$(node scripts/find_port.js)

if [ -z "$PORT" ]; then
    echo "Could not find a free port."
    exit 1
fi

echo "Selected Port: $PORT"
export PORT
export NODE_ENV=production

# Re-run migrations
echo "Running migrations..."
npx prisma migrate deploy

echo "Starting server..."
# Check if dist/src/index.js exists, if not rebuild
if [ ! -f "dist/src/index.js" ]; then
    echo "Build not found, building..."
    npm install
    npm run build
fi

nohup npm start > server.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID on port $PORT"
