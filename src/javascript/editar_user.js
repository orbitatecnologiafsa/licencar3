
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
        const clientesRef = db.collection('clientes');
        const querySnapshot = await clientesRef.where('cpf_cnpj', '==', getCpf('cpf_cnpj')).get();
        
        const form = document.getElementById("client_form");

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = new FormData(e.target);
            const cpf = data.get("cpf_cnpj");
    
            const formData = {};
            for (let [key, value] of data.entries()) {
                formData[key] = value;
            }

            if(confirm("Tem certeza que deseja atualizar este cliente?")){
               if(validarCPF(cpf)){
                    if (!querySnapshot.empty) {
                        
                        const doc = querySnapshot.docs[0];

                        const docId = doc.id;
                        
                        const clientesAtt = db.collection('clientes').doc(docId);
                        await clientesAtt.update(formData)
                        
                        alert('Cliente atualizado com sucesso!');
                    }else {
                        console.log('Nenhum documento encontrado.');
                    }
                }
            }
        });
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}
//
function validarCPF(cpf) {
    if(cpf.length == 11 || cpf.length == 14) {
        if(cpf.length == 11){
            cpf = cpf.replace(/[^\d]+/g, ''); 

        if (cpf.length !== 11) {
            return false;
        }
        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = (resto >= 10) ? 0 : resto;

        if (parseInt(cpf.charAt(9)) !== digitoVerificador1) {
            return false;
        }

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = (resto >= 10) ? 0 : resto;

        if (parseInt(cpf.charAt(10)) !== digitoVerificador2) {
            return false;
        }
        return true;
        }

        else if(cpf.length == 14){
            let cnpj = cpf;
            cnpj = cnpj.replace(/[^\d]+/g, ''); 

            if (cnpj.length !== 14) {
                return false;
            }
            if (/^(\d)\1+$/.test(cnpj)) {
                return false;
            }
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            let digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                pos = 9;
                }
            }
            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== parseInt(digitos.charAt(0))) {
                return false;
            }
            tamanho += 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== parseInt(digitos.charAt(1))) {
                return false;
            }
            return true;
            }

    }
    else{
        return false;
    }
}
exibir_info();
editar_user();