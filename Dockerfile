FROM node:22.9.0-bookworm

COPY . /var/www/conecxo_comms
WORKDIR /var/www/conecxo_comms

RUN npm install && npm run build

ENTRYPOINT ["node", "dist/server.js"]

EXPOSE 8000