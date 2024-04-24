

async function displayClient() {


  const clienteRef = db.collection('clientes');
  const clienteLista = document.getElementById('clienteLista');
  const snapshot = await clienteRef.get();

  try {
    snapshot.forEach(doc => {
      const clienteItem = document.createElement('li');
      clienteItem.setAttribute('class','item-list');

      const itemNome = document.createElement('p');
      itemNome.setAttribute('class','item')
      itemNome.textContent = `${doc.data().nome}`;
      clienteItem.appendChild(itemNome);

      const itemCpf_cnpj = document.createElement('p');
      itemCpf_cnpj.setAttribute('class', 'item');
      const cpf_cnpj = doc.data().cpf_cnpj;
      const cpf_cnpj_formatado = formatarCPFouCNPJ(cpf_cnpj);

      itemCpf_cnpj.textContent = cpf_cnpj_formatado;
      clienteItem.appendChild(itemCpf_cnpj);

      const itemEndereco = document.createElement('p');
      itemEndereco.setAttribute('class','item');
      itemEndereco.textContent = `${doc.data().endereco}`;
      clienteItem.appendChild(itemEndereco);

      const itemCidade = document.createElement('p');
      itemCidade.setAttribute('class','item');
      itemCidade.textContent = `${doc.data().cidade}`;
      clienteItem.appendChild(itemCidade);

      const itemRevenda = document.createElement('p');
      itemRevenda.setAttribute('class','item');  
      itemRevenda.textContent = `${doc.data().revenda}`;
      clienteItem.appendChild(itemRevenda);

      const itemData = document.createElement('p');
      itemData.setAttribute('class','item');
      itemData.textContent = `${doc.data().data_validade}`;
      clienteItem.appendChild(itemData);

      const imgDiv = document.createElement('div');
      imgDiv.setAttribute('class','img-div');

      const deleteImg = document.createElement('img');
      deleteImg.setAttribute('class','icon');
      deleteImg.setAttribute('id','deleteImg');
      deleteImg.setAttribute('src','src/images/remove.png');
      deleteImg.setAttribute('onclick', `deleteClient('${doc.data().cpf_cnpj}')`);

      const editImg = document.createElement('img');
      editImg.setAttribute('class','icon');
      editImg.setAttribute('src','src/images/edit.png');
      editImg.setAttribute('onclick', `editClient('${doc.data().cpf_cnpj}')`);

      imgDiv.appendChild(editImg);
      imgDiv.appendChild(deleteImg);
      clienteItem.appendChild(imgDiv);

      if(doc.data().status === 'inativo'){ 
        clienteItem.setAttribute('class','desativado');
        deleteImg.setAttribute('src','src/images/check.png');
        deleteImg.setAttribute('onclick', `activeClient('${doc.data().cpf_cnpj}')`);
      }
      else{
        clienteItem.setAttribute('class','item-list');
        deleteImg.setAttribute('src','src/images/remove.png');
        deleteImg.setAttribute('onclick', `deleteClient('${doc.data().cpf_cnpj}')`);
      }

      clienteLista.appendChild(clienteItem);   
        
    });
  } catch(error) {
    console.log("A lista está vazia, erro: " + error);
  }
  
}
function formatarCPFouCNPJ(cpf_cnpj) {

  cpf_cnpj = cpf_cnpj.replace(/\D/g, '');

  if (cpf_cnpj.length === 11) { // CPF
      return cpf_cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cpf_cnpj.length === 14) { // CNPJ
      return cpf_cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1 $2 $3/$4-$5');
  } else {
      return cpf_cnpj; 
  }
}

function abrirCadastroUser() {
  var width = 800;
  var height = 800;
  var left = (window.innerWidth - width) / 2;
  var top = (window.innerHeight - height) / 2;
  var options = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;
  var popup = window.open('src/pages/cadastro_user.html', 'Cadastro de Usuário', options);
  if (!popup || popup.closed || typeof popup.closed == 'undefined') {
      alert('Por favor, desbloqueie os popups para continuar.');
  }
}

async function deleteClient(cpf_cnpj) {
  
  if(confirm("Tem certeza que deseja desativar o cliente?")) {
  try {
    const clienteRef = await db.collection('clientes');
    const querySnapshot = await clienteRef.where('cpf_cnpj', '==', cpf_cnpj).get();
    console.log(cpf_cnpj)
              
    if (!querySnapshot.empty) {
        
        const doc = querySnapshot.docs[0];

        const docId = doc.id;
        console.log(docId);
       
        const atualizarStatus = await db.collection('clientes').doc(docId).update({status : "inativo"});
        console.log(atualizarStatus);
          
        alert("Cliente desativado com sucesso!");
    } else {
        console.log('Nenhum documento encontrado.');
    }
      
    window.location.reload();
  } catch (error) {
    console.error("Ocorreu um erro ao desativar o cliente:", error);
    } 
  }

}
async function activeClient(cpf_cnpj) {

  if(confirm("Tem certeza que deseja ativar o cliente?")) {
  try {
    const clienteRef = await db.collection('clientes');
    const querySnapshot = await clienteRef.where('cpf_cnpj', '==', cpf_cnpj).get();
    console.log(cpf_cnpj)
              
    if (!querySnapshot.empty) {
        
        const doc = querySnapshot.docs[0];
        const docId = doc.id;
        console.log(docId);
        
        const atualizarStatus = await db.collection('clientes').doc(docId).update({status : "ativo"});
        console.log(atualizarStatus);
          
        alert("Cliente ativado com sucesso!");
    }else {
      console.log('Nenhum documento encontrado.');
    }
    
    window.location.reload();
  } catch (error) {
    console.error("Ocorreu um erro ao ativar o cliente:", error);
    }
  }
}
function editClient(cpf_cnpj) {
  var width = 800;
  var height = 800;
  var left = (window.innerWidth - width) / 2;
  var top = (window.innerHeight - height) / 2;
  var options = 'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top;

  var url = 'src/pages/editar_user.html?cpf_cnpj=' + cpf_cnpj;

  var popup = window.open(url, 'Edição de Usuário', options);
  if (!popup || popup.closed || typeof popup.closed == 'undefined') {
      alert('Por favor, desbloqueie os popups para continuar.');
  }
}
function verificarLogin(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Usuário está autenticado:", user);
      displayClient();
    } else {
      console.log("Usuário não está autenticado.");
      window.open('src/pages/login.html', '_self');
    }
  });
}
verificarLogin();

async function logout() {
  if (confirm("Tem certeza que deseja sair?")) {
    try {
      await firebase.auth().signOut();
      window.reload;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }
}