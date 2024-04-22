async function teste() {
    try {
        const clientsRef = db.collection('clientes');
        
        const form = document.getElementById("client_form");

        form.addEventListener("submit", async e => {
            e.preventDefault();
            const data = new FormData(e.target);
            const cpf = data.get("cpf_cnpj");

            const querySnapshot = await clientsRef.where("cpf_cnpj", "==", cpf).get();

            if (!querySnapshot.empty) {
                alert("CPF ja cadastrado!");   
                console.log("CPF já cadastrado!");
                return;
            }

            const formData = {};
            for (let [key, value] of data.entries()) {
                formData[key] = value;
            }

            await clientsRef.add(formData);
            alert('Cliente cadastrado com sucesso!')
            console.log("Dados enviados com sucesso!");
        });
    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}

teste();
