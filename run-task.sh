#!/bin/bash

echo "* Run task ..."
cp /vagrant/docker-compose.yaml .
sg docker -c "docker compose up --build -d"