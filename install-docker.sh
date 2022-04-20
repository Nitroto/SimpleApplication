#!/bin/bash

echo "* Add hosts ..."
echo "192.168.100.101 docker.vm.task docker" >> /etc/hosts

echo "* Add required packages"
apt-get update
apt-get install -y ca-certificates curl gnupg2 lsb-release

echo "* Add repository key"
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "* Add the Docker repository"
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "* Install the packages (git, Docker)"
apt-get update
apt-get install -y fontconfig git docker-ce docker-ce-cli containerd.io

echo "* Enable and start Docker ..."
systemctl enable --now docker

echo "* Adjust the group membership"
usermod -aG docker vagrant

echo "* Install Docker Compose"
su - vagrant
mkdir -p /home/vagrant/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.4.1/docker-compose-linux-x86_64 -o /home/vagrant/.docker/cli-plugins/docker-compose
chmod +x /home/vagrant/.docker/cli-plugins/docker-compose