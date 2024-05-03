const listaCompleta = []
async function displayClient() {

  const clienteRef = db.collection('clientes');
  try {
    const snapshot = await clienteRef.orderBy('nome').get();
    snapshot.forEach(doc => {
  
      const cliente = {
          nome: doc.data().nome,
          cpf_cnpj: formatarCPFouCNPJ(doc.data().cpf_cnpj),
          endereco: doc.data().endereco,
          cidade: doc.data().cidade,
          revenda: doc.data().revenda,
          status: doc.data().status,
          data_validade: doc.data().data_validade
      };
      listaCompleta.push(cliente); 
      exibirElementos(listaCompleta, paginaAtual);
      exibirPaginacao(listaCompleta);
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
       
        const atualizarStatus = await db.collection('clientes').doc(docId).update({status : "INATIVO"});
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
        
        const atualizarStatus = await db.collection('clientes').doc(docId).update({status : "ATIVO"});
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
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      console.log("Usuário está autenticado:", user);
      const adminDb = db.collection('admin');
      const querySnapshot = await adminDb.get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userLogado = document.getElementById('userLogado');
        userLogado.innerText = "Logado em: " + doc.data().nome;
      }
      const pesquisa = document.getElementById('pesquisa').value;
      displayClient();
    } else {
      console.log("Usuário não está autenticado.");
      window.open('src/pages/login.html', '_self');
    }
  });
}

async function pesquisar(event) {

  event.preventDefault();

  const pesquisa = document.getElementById('pesquisa').value.toUpperCase();

  if(pesquisa == ""){
    displayClient();
    return;
  }
  const clienteRef = db.collection('clientes');
  let clientePesquisado = await clienteRef.where('cpf_cnpj', '==', pesquisa).get();
  document.getElementById('clienteLista').innerHTML = '';

  if (clientePesquisado.empty) {
    clientePesquisado = await clienteRef.where('nome', '==', pesquisa).get(); //pesquisa por nome
    if(clientePesquisado.empty){
      clientePesquisado = await clienteRef.where('revenda', '==', pesquisa).get(); //pesquisa por revenda
      if(clientePesquisado.empty){
        clientePesquisado = await clienteRef.where('cidade', '==', pesquisa).get(); //pesquisa por cidade
        if(clientePesquisado.empty){
          clientePesquisado = await clienteRef.where('status', '==', pesquisa).get(); //pesquisa por status
          if (clientePesquisado.empty) {
            console.log('Nenhuma empresa encontrada.');
            alert('Nenhuma empresa encontrada');
            displayClient();
            return;
          }
        }
      }     
    }
  }
  clientePesquisado.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    const clienteItem = document.createElement('li');
    clienteItem.setAttribute('class','item-list')

    const itemNome = document.createElement('p');
    itemNome.setAttribute('class','item')
    itemNome.textContent = `${doc.data().nome}`;

    const itemCpf_cnpj = document.createElement('p');
    itemCpf_cnpj.setAttribute('class', 'item');
    const cpf_cnpj = doc.data().cpf_cnpj;
    const cpf_cnpj_formatado = formatarCPFouCNPJ(cpf_cnpj);
    itemCpf_cnpj.textContent = `${cpf_cnpj_formatado}`;

    const itemEndereco = document.createElement('p');
    itemEndereco.setAttribute('class','item');
    itemEndereco.textContent = `${doc.data().endereco}`;

    const itemCidade = document.createElement('p');
    itemCidade.setAttribute('class','item');
    itemCidade.textContent = `${doc.data().cidade}`;

    const itemRevenda = document.createElement('p');
    itemRevenda.setAttribute('class','item');
    itemRevenda.textContent = `${doc.data().revenda}`;

    const itemData_validade = document.createElement('p');
    itemData_validade.setAttribute('class','item');
    itemData_validade.textContent = `${doc.data().data_validade}`;

    const imgDiv = document.createElement('div');
    imgDiv.setAttribute('class','img-div');

    const deleteImg = document.createElement('img');
    deleteImg.setAttribute('class','icon');
    deleteImg.setAttribute('id','deleteImg');
    deleteImg.setAttribute('onclick', `deleteClient('${doc.data().cpf_cnpj}')`);

    const editImg = document.createElement('img');
    editImg.setAttribute('class','icon');
    editImg.setAttribute('src','src/images/edit.png');
    editImg.setAttribute('onclick', `editClient('${doc.data().cpf_cnpj}')`);

    imgDiv.appendChild(editImg);
    imgDiv.appendChild(deleteImg);
    clienteItem.appendChild(imgDiv);

    if(doc.data().status === 'INATIVO'){ 
      clienteItem.setAttribute('class','desativado');
      deleteImg.setAttribute('src','src/images/check.png');
      deleteImg.setAttribute('onclick', `activeClient('${doc.data().cpf_cnpj}')`);
    }
    else{
      clienteItem.setAttribute('class','item-list');
      deleteImg.setAttribute('src','src/images/remove.png');
      deleteImg.setAttribute('onclick', `deleteClient('${doc.data().cpf_cnpj}')`);
    }

    clienteItem.appendChild(itemNome);
    clienteItem.appendChild(itemCpf_cnpj);
    clienteItem.appendChild(itemEndereco);
    clienteItem.appendChild(itemCidade);
    clienteItem.appendChild(itemRevenda);
    clienteItem.appendChild(itemData_validade);
    clienteItem.appendChild(imgDiv);

    const clienteLista = document.getElementById('clienteLista');
    clienteLista.appendChild(clienteItem);

    document.getElementById('pesquisa').value = '';
  })
}
document.getElementById('form_pesquisa').addEventListener('submit', pesquisar);
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

const elementosPorPagina = 10;
let paginaAtual = 1;

function exibirElementos(lista, pagina) {

  
  const startIndex = (pagina - 1) * elementosPorPagina;
  const endIndex = startIndex + elementosPorPagina;

  console.log("Lista:", lista);
  console.log("startIndex:", startIndex);
  console.log("endIndex:", endIndex);
  const elementosDaPagina = lista.slice(startIndex, endIndex);

  console.log("elementos da pagina: ", elementosDaPagina);

  const clienteLista = document.getElementById('clienteLista');
  clienteLista.innerHTML = ''; 

  elementosDaPagina.forEach(cliente => {

    console.log(cliente);
      const clienteItem = document.createElement('li');
      clienteItem.setAttribute('class','item-list');

      const itemNome = document.createElement('p');
      itemNome.setAttribute('class','item');
      itemNome.textContent = cliente.nome;
      
      clienteItem.appendChild(itemNome);

      const itemCpf_cnpj = document.createElement('p');
      itemCpf_cnpj.setAttribute('class', 'item');
      itemCpf_cnpj.textContent = cliente.cpf_cnpj;
      clienteItem.appendChild(itemCpf_cnpj);

      const itemEndereco = document.createElement('p');
      itemEndereco.setAttribute('class','item');
      itemEndereco.textContent = cliente.endereco;
      clienteItem.appendChild(itemEndereco);

      const itemCidade = document.createElement('p');
      itemCidade.setAttribute('class','item');
      itemCidade.textContent = cliente.cidade;
      clienteItem.appendChild(itemCidade);

      const itemRevenda = document.createElement('p');
      itemRevenda.setAttribute('class','item');
      itemRevenda.textContent = cliente.revenda;
      clienteItem.appendChild(itemRevenda);

      const itemData = document.createElement('p');
      itemData.setAttribute('class','item');
      itemData.textContent = cliente.data_validade;
      clienteItem.appendChild(itemData);

      const imgDiv = document.createElement('div');
      imgDiv.setAttribute('class','img-div');

      const deleteImg = document.createElement('img');
      deleteImg.setAttribute('class','icon');
      deleteImg.setAttribute('id','deleteImg');
      deleteImg.setAttribute('onclick', `deleteClient('${cliente.cpf_cnpj}')`);

      const editImg = document.createElement('img');
      editImg.setAttribute('class','icon');
      editImg.setAttribute('src','src/images/edit.png');
      editImg.setAttribute('onclick', `editClient('${cliente.cpf_cnpj}')`);

      imgDiv.appendChild(editImg);
      imgDiv.appendChild(deleteImg);
      clienteItem.appendChild(imgDiv);

      if(cliente.status === 'INATIVO'){ 
        clienteItem.setAttribute('class','desativado');
        deleteImg.setAttribute('src','src/images/check.png');
        deleteImg.setAttribute('onclick', `activeClient('${cliente.cpf_cnpj}')`);
      }
      else{
        clienteItem.setAttribute('class','item-list');
        deleteImg.setAttribute('src','src/images/remove.png');
        deleteImg.setAttribute('onclick', `deleteClient('${cliente.cpf_cnpj}')`);
      }
      clienteLista.appendChild(clienteItem);
  });
}

function exibirPaginacao(lista) {
    const numeroDePaginas = Math.ceil(lista.length / elementosPorPagina);
    let paginationHtml = '';

    for (let i = 1; i <= numeroDePaginas; i++) {
        paginationHtml += `<button onclick="irParaPagina(${i})" class="botao-paginacao">${i}</button>`;
    }

    document.getElementById('pagination').innerHTML = paginationHtml;
}

function irParaPagina(pagina) {
  paginaAtual = pagina;
  exibirElementos(listaCompleta, pagina);
  atualizarPaginacao();
}

function atualizarPaginacao() {
    const botoesPaginacao = document.querySelectorAll('#pagination button');
    botoesPaginacao.forEach((botao, indice) => {
        if (indice + 1 === paginaAtual) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }
    });
}
