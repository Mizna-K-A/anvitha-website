#!/bin/bash
export AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="ap-south-1"

sudo docker buildx build --platform linux/amd64 -t anvitha-website .

sudo docker tag anvitha-website:latest 727516060995.dkr.ecr.ap-south-1.amazonaws.com/anvitha-website:latest


aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 727516060995.dkr.ecr.ap-south-1.amazonaws.com

sudo docker push 727516060995.dkr.ecr.ap-south-1.amazonaws.com/anvitha-website:latest

