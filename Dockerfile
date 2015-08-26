FROM node:0.12

MAINTAINER Scott Vickers

RUN useradd -m odin
USER odin
WORKDIR /home/odin

ADD . .

RUN npm install --production

CMD [ "npm", "start" ]
