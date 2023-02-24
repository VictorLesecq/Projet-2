
login();

function login(){
	const myForm = document.getElementById("loginForm");
	myForm.addEventListener("submit",function(event){   
		event.preventDefault();				//preventDefault ici?
		loginEffect(event);
	})
}

async function loginEffect(event){
	//event.preventDefault();				//ou ici?
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
		let response = await answer.json();
		if(Object.keys(response)[0]==="error" || Object.keys(response)[0]==="message"){
			alert("Erreur dans l’identifiant ou le mot de passe");
		} else {
			const token=response.token;
			const tokenJson = JSON.stringify(token);
			window.localStorage.setItem("token",tokenJson);
			document.location.href="./index.html";
		};
	}
	catch(error) {
		console.log(error);
	};
};