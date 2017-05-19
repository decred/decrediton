FROM ubuntu:trusty

LABEL description="Decrediton builder image"
LABEL version="1.1"
LABEL maintainer "peter@prioritylane.com"

ENV NODE_VERSION v6.9.5
ENV GRPC_COMMIT=cc2e048e84eaa418cab393553594a3fefb891037
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

# create directory to get source from
RUN mkdir /src && \
    chown $USER /src

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

# Install & build grpc
RUN   git clone https://github.com/grpc/grpc && \
  cd grpc && \
  git checkout $GRPC_COMMIT && \
  git submodule update --init
