#!/bin/bash
cd /home/ec2-user/4155-project

rm -rf frontend/dist

git pull

sudo chown -R ec2-user:nginx /home/ec2-user/4155-project/frontend/dist
sudo chmod -R 775 /home/ec2-user/4155-project/frontend/dist