async function teste() {
    try {
        const clientsRef = db.collection('clientes');
        
        const form = document.getElementById("client_form");

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = new FormData(e.target);
            const cpf = data.get("cpf_cnpj");

            const querySnapshot = await clientsRef.where("cpf_cnpj", "==", cpf).get();

            if(validarCPF(cpf)){
                if (!querySnapshot.empty) {
                    alert("CPF ja cadastrado!");   
                    console.log("CPF já cadastrado!");
                    return;
                }
    
                const formData = {};
                for (let [key, value] of data.entries()) {
                    formData[key] = value;
                    formData["status"] = "ativo";
                }
    
                await clientsRef.add(formData);
                alert('Cliente cadastrado com sucesso!')
                console.log("Dados enviados com sucesso!");
            }
            else{
                alert("CPF/CNPJ inválido");
            }    
            
        });
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}

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
teste();
