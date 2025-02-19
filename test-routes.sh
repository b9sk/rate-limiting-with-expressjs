#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password12"}' http://localhost:3000/login
echo ""