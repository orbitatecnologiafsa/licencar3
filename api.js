const express = require('express');
const admin = require("firebase-admin");

const serviceAccount = require("./licencar3-firebase-adminsdk-xsgs4-d00851cb29.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.get('/api/informacoes/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;

    const snapshot = await admin.firestore().collection('clientes').where('cpf_cnpj', '==', cpf).get();
    
    if (snapshot.empty) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }

    let userData = [];

    snapshot.forEach(doc => {
      userData.push(doc.data());
    });

    res.json(userData);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
