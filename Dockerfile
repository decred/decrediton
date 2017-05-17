FROM ubuntu:trusty

LABEL description="Decrediton builder image"
LABEL version="1.0"
LABEL maintainer "peter@prioritylane.com"

ENV NODE_VERSION v6.9.5
ENV TERM linux
ENV USER build

# create user
RUN adduser --disabled-password --gecos ''  build

# update base distro & install build tooling
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get install -qy build-essential python git curl

# create directory for build artifacts, adjust user permissions
RUN mkdir /release && \
    chown $USER /release

# switch user
USER $USER
WORKDIR /home/$USER
ENV HOME /home/$USER
ENV NVM_DIR $HOME/.nvm

# install & configure NodeJS
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    npm set progress=false; npm set cache-min 999999999
