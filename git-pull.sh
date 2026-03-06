#!/bin/bash
cd /home/ec2-user/4155-project

rm -rf frontend/dist

git pull

sudo chown -R nginx:nginx /home/ec2-user/4155-project/frontend/dist
sudo chmod -R 755 /home/ec2-user/4155-project/frontend/dist