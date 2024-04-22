
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
    const clientesRef = db.collection('clientes');
    const querySnapshot = await clientesRef.where('cpf_cnpj', '==', getCpf('cpf_cnpj')).get();

    if (querySnapshot.empty) {
        console.log('Nenhum documento encontrado.');
    } else {
        const doc = querySnapshot.docs[0];
        console.log('Document data:', doc.data());
        document.getElementById('nome').setAttribute('value', doc.data().nome);
        document.getElementById('cpf_cnpj').setAttribute('value', doc.data().cpf_cnpj);
        document.getElementById('revenda').setAttribute('value', doc.data().revenda);
        document.getElementById('endereco').setAttribute('value', doc.data().endereco);
        document.getElementById('cidade').setAttribute('value', doc.data().cidade);
        document.getElementById('data_validade').setAttribute('value', doc.data().data_validade);
    }
}

async function editar_user() {
    try {
        const firebasecpf = getCpf('cpf_cnpj');
        const clientesRef = db.collection('clientes');
        const querySnapshot = await clientesRef.where('cpf_cnpj', '==', getCpf('cpf_cnpj')).get();
        
        const form = document.getElementById("client_form");

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = new FormData(e.target);
    
            const formData = {};
            for (let [key, value] of data.entries()) {
                formData[key] = value;
            }

            if(confirm("Tem certeza que deseja atualizar este cliente?")){
               
                if (!querySnapshot.empty) {
                    
                    const doc = querySnapshot.docs[0];

                    const docId = doc.id;
                    
                    const clientesAtt = db.collection('clientes').doc(docId);
                    await clientesAtt.update(formData)
                    
                    alert('Cliente atualizado com sucesso!');
                } else {
                    console.log('Nenhum documento encontrado.');
                }
            }
        });
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}
//
exibir_info();
editar_user();