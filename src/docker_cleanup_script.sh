sudo docker system prune -a
sudo docker stop $(sudo docker ps -a -q)
sudo docker rm $(sudo docker ps -a -q)
sudo docker rm -vf $(docker ps -aq)
sudo docker volume prune
sudo docker rmi -f $(docker images -aq)
