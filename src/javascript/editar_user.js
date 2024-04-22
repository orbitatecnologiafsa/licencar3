
function getCpf(name, url) {

    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



async function exibir_info(){
   
    const clientesRef = db.collection('clientes').doc(getCpf('cpf_cnpj'));
    const clienteDoc = await clientesRef.get();

    if (!clienteDoc.exists) {
        console.log('Error!');
      } else {
        console.log('Document data:', clienteDoc.data());
        document.getElementById('nome').setAttribute('value', clienteDoc.data().nome);
        document.getElementById('cpf_cnpj').setAttribute('value', clienteDoc.data().cpf_cnpj);
        document.getElementById('revenda').setAttribute('value', clienteDoc.data().revenda);
        document.getElementById('endereco').setAttribute('value', clienteDoc.data().endereco);
        document.getElementById('data_validade').setAttribute('value', clienteDoc.data().data_validade);
      }
}

async function editar_user() {
    try {
        const firebasecpf = getCpf('cpf_cnpj');
        //const clientesTodos = db.collection('clientes');
        const clientesRef = db.collection('clientes').doc(firebasecpf);
        
        const form = document.getElementById("client_form");

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = new FormData(e.target);
    
            const formData = {};
            for (let [key, value] of data.entries()) {
                formData[key] = value;
            }

            if(confirm("Tem certeza que deseja atualizar este cliente?")){
                alert('Cliente atualizado com sucesso!');
                await clientesRef.update(formData);
            }
        });
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}

exibir_info();
editar_user();