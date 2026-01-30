#!/bin/bash
echo "Starting tunnel using Serveo (SSH)..."
echo "This avoids the LocalTunnel password protection page."
echo "Use the generated URL below for your PayOS Webhook."
echo ""
echo "Webhook URL format: https://<subdomain>.serveo.net/api/payment/webhook"
echo ""
echo "Press Ctrl+C to stop."
echo "-------------------------------------------------------"

# Forward port 3000 to serveo.net
ssh -R 80:localhost:3000 serveo.net
