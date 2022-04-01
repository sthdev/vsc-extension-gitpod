FROM gitpod/workspace-full

RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get -y upgrade \
    && sudo apt-get -y install --no-install-recommends libasound2 libgbm1 libgtk-3-0 libnss3 xvfb xauth iputils-ping \
    && sudo rm -rf /var/lib/apt/lists/*
