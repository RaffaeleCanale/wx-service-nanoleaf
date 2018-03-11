FROM node
WORKDIR /etc/nanoleaf/

COPY package*.json /etc/nanoleaf/
COPY webpack.config.js /etc/nanoleaf/
COPY src/ /etc/nanoleaf/src
COPY .babelrc /etc/nanoleaf/
COPY config.json /etc/nanoleaf/
COPY consumer.json /etc/nanoleaf/

RUN npm install
RUN npm run build

CMD ["npm", "start"]
