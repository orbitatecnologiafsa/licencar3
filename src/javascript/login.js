function login() {
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuário autenticado:', user.uid);
            window.open('../../index.html', '_self');
            alert("Login bem sucedido");
        })
        .catch((error) => {
            console.error('Erro ao autenticar usuário:', error);
            console.error('Código de erro:', error.code);
            alert("Falha no login");
        });
}