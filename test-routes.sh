#!/bin/bash
#admin:password - верные данные

curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "password1"}' http://localhost:3000/login
echo ""