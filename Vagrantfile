# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.ssh.insert_key = false
  vm_box = "AsTodorov/debian-bullseye-11.3.x86_64"

  config.vm.define "docker" do |docker|
    docker.vm.box = vm_box
    docker.vm.hostname = "docker.vm.task"
    docker.vm.network "private_network", ip: "192.168.100.101"
    docker.vm.network "forwarded_port", guest: 4000, host: 4000, auto_correct: true
    docker.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true
    docker.vm.network "forwarded_port", guest: 5050, host: 5050, auto_correct: true
    docker.vm.synced_folder "./simple-backend", "/vagrant/simple-backend"
    docker.vm.synced_folder "./simple-frontend", "/vagrant/simple-frontend"
    docker.vm.synced_folder "./config", "/vagrant/config"
    docker.vm.provision "shell", path: "install-docker.sh"
    docker.vm.provision "shell", path: "run-task.sh", privileged: false
    docker.vm.provider "virtualbox" do |vm|
      vm.customize ["modifyvm", :id, "--memory", "4098"]
    end
  end
end