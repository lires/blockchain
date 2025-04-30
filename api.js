const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./class/blockchain');
const P2PServer = require('./p2p-server');

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const data = req.body.data;
  
  if (!data) {
    return res.status(400).json({ error: 'Aucune donnée fournie pour le minage' });
  }
  
  const block = blockchain.addBlock(data);
  
  p2pServer.syncChain();
  
  res.json({
    message: 'Nouveau bloc miné avec succès',
    block: block
  });
});

if (require.main === module) {
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`HTTP démarré port ${PORT}`);
  });
  
  p2pServer.listen();
}

module.exports = app;