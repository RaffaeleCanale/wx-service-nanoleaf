FROM node
WORKDIR /etc/nanoleaf/

COPY src/ src/
COPY package*.json webpack.config.js .babelrc ./

RUN npm install && \
    npm run build

COPY config.json consumer.json ./

CMD ["npm", "start"]
