FROM node:22.9.0-bookworm

COPY . /var/www/conecxo_comms
WORKDIR /var/www/conecxo_comms

RUN npm install

ENTRYPOINT ["npm", "run", "serve"]

EXPOSE 8081