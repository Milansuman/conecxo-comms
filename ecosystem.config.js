module.exports = {
  apps : [{
    name: "conecxo-comms",
    script: 'dotenv -e .env.prod -- ./dist/server.js',
    watch: true,
  }]
};
