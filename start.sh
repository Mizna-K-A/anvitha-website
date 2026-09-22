#!/bin/sh

# Start nginx in background
nginx -g 'daemon off;' &

# Start Next.js
npm start