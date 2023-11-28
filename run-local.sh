aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 192861452822.dkr.ecr.us-east-1.amazonaws.com
docker build -t im_node .
docker run -p 9000:8080 im_node
