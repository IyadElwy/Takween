FROM debian:12.10 AS base

RUN apt update && apt upgrade -y \
    && apt install -y git


FROM base AS dev-container

RUN apt install -y curl build-essential \
    python3-dev libmagic1 postgresql-client && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    . $HOME/.local/bin/env && \
    uv python install 3.11 --default --preview


RUN curl -o- \
    https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh \
    | bash && export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" && \
    nvm install 22
