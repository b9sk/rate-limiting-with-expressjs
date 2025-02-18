#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "user", "password": "123"}' http://localhost:3000/login
echo ""