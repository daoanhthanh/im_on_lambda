FROM --platform=arm64 arm64v8/amazonlinux:2


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Set up nvm environment variables
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION 20.9.0
# ENV NODE_VERSION 16


RUN yum install -y tar gzip which

RUN source "$NVM_DIR/nvm.sh" \
  && nvm install "$NODE_VERSION" \
  && nvm alias default "$NODE_VERSION" \
  && nvm use default \
  && npm install -g npm

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:"$NVM_DIR"/versions/node/v"$NODE_VERSION"/bin


WORKDIR /root/result

#docker run -it --rm -v $(pwd):/root/result <docker_image>