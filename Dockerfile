# FROM --platform=arm64 public.ecr.aws/lambda/nodejs:20.2023.11.21.13-arm64
FROM --platform=linux/amd64 public.ecr.aws/lambda/nodejs:20-x86_64


RUN curl https://imagemagick.org/archive/binaries/magick -o /usr/bin/magick && \
  chmod +x /usr/bin/magick

COPY *.js ${LAMBDA_TASK_ROOT}/
COPY package.json ${LAMBDA_TASK_ROOT}/package.json

RUN npm install

WORKDIR ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
