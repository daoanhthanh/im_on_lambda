FROM --platform=arm64 public.ecr.aws/lambda/nodejs:20.2023.11.21.13-arm64

COPY imagemagick/bin /usr/bin
COPY imagemagick/etc /usr/etc
COPY imagemagick/include /usr/include
COPY imagemagick/lib /usr/lib
COPY imagemagick/share /usr/share

COPY node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY *.js ${LAMBDA_TASK_ROOT}/
COPY package.json ${LAMBDA_TASK_ROOT}/package.json

WORKDIR ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
