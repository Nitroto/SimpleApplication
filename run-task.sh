#!/bin/bash

echo "* Run task ..."
cd /vagrant
sg docker -c "docker compose up --build -d"