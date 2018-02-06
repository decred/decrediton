FROM node:8.9.4

LABEL description="Decrediton builder image"
LABEL version="1.2"
LABEL maintainer "john@netpurgatory.com"

RUN mkdir -p /usr/src/app

COPY ./ /usr/src/app
WORKDIR /usr/src/app

RUN yarn && yarn lint && yarn test && yarn run package-linux
