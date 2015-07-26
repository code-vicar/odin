FROM node:0.12

MAINTAINER Scott Vickers

COPY . /usr/src/app

RUN useradd -m odin
USER odin
WORKDIR /home/odin

ENV AWS_PROFILE=odin

RUN mkdir ./.aws && cp /usr/src/app/aws_credentials ./.aws/credentials
RUN cp -r /usr/src/app/* .

RUN npm install --production

CMD [ "npm", "start" ]
