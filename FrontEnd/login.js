
login();

function login(){
	const myForm = document.getElementById("loginForm");
	myForm.addEventListener("submit",loginEffect)
}

async function loginEffect(event){
	event.preventDefault();
	let login = document.getElementById("email").value;
	let password = document.getElementById("password").value;
	let userLogin = {
		"email":login,
		"password":password,
	};
	try{
		const answer = await fetch("http://localhost:5678/api/users/login", {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(userLogin)
		});
		if(answer.ok){
			let response = await answer.json();
			const token=response.token;
			const tokenJson = JSON.stringify(token);
			window.localStorage.setItem("token",tokenJson);
			document.location.href="./index.html";
		} else {
			alert("Erreur dans l’identifiant ou le mot de passe");
		};
	}
	catch(error) {
		console.log(error);
	};
};