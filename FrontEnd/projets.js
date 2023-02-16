let projets = window.localStorage.getItem("projets");
let filtres =window.localStorage.getItem("filtres");

//Project content loading from the API, if not in the LocalStorage
if (projets === null){
	// Récupération des pièces depuis l'API
	const reponse = await fetch("http://localhost:5678/api/works");
	projets = await reponse.json();
	// Transformation des pièces en JSON
	const valeurProjets = JSON.stringify(projets);
	// Stockage des informations dans le localStorage
	window.localStorage.setItem("projets", valeurProjets);
}else{
	projets = JSON.parse(projets);
};

//Filter list creation from the categorie loading from the API, if not in the LocalStorage
if (filtres === null){
	const reponse = await fetch("http://localhost:5678/api/categories");
	const categories = await reponse.json();
	//creation of the filter list from the API
	filtres = categories.map(function(a){
		return a.name;
	});
	//add of the filter "tous" in the filter list
	filtres.unshift("Tous");
	//upload of the filter list in the localStorage
	const valeurFiltres = JSON.stringify(filtres);
	window.localStorage.setItem("filtres",valeurFiltres);
}else{
	filtres = JSON.parse(filtres);
};
console.log(filtres);


//Function to Create all filters
function creationFilter(liste){	
	//creation of all the filters from the filter list
	for(let i in liste){
		const bouton = document.createElement("button");
		bouton.innerText=liste[i];
		bouton.classList.add("bouton");
		filtreConteneur.appendChild(bouton);
		bouton.dataset.id=liste[i];
	}
	const bouton_tous = document.querySelector(".filtres button");
	bouton_tous.classList.add("bouton_tous");
	bouton_tous.classList.add("selected");
}

function creationCard(liste){
	for (let i in liste){
		const figure = document.createElement("figure");
		gallery.appendChild(figure);
		const imageElement = document.createElement("img");
		imageElement.src = liste[i].imageUrl;
		imageElement.alt = liste[i].title;
		figure.appendChild(imageElement);
		const figCaption = document.createElement("figcaption");
		figCaption.innerText = liste[i].title;
		figure.appendChild(figCaption);
	}
}

const gallery = document.querySelector(".gallery");
const filtreConteneur = document.createElement("div");
filtreConteneur.classList.add("filtres");
gallery.parentElement.insertBefore(filtreConteneur,gallery);

let selection = ["Tous"];
creationCard(projets);
creationFilter(filtres);


const bouton_tous=document.querySelector(".bouton_tous");
bouton_tous.addEventListener("click",function(){
	if(selection[0]!=="Tous"){
		for(let i in selection){
			const sel = document.querySelector(`button[data-id="${selection[i]}"]`);
			sel.classList.toggle("selected");
		}		
		selection=["Tous"];
		gallery.innerHTML="";
		creationCard(projets);
		bouton_tous.classList.toggle("selected");
	}
});

const  bouton_trier = document.querySelectorAll(".bouton");
for (let i=1;i<bouton_trier.length;i++){
	bouton_trier[i].addEventListener("click",function(event){
		event.target.classList.toggle("selected");

		if(selection[0]==="Tous"){
			selection=[];
			selection.push(event.target.innerText);
			bouton_tous.classList.toggle("selected");
		} else {
			if(selection.includes(event.target.innerText)){
				selection.splice(selection.indexOf(event.target.innerText),1);
			} else {
			selection.push(event.target.innerText);
			}
		}
		if(selection.length===0){
			bouton_tous.classList.toggle("selected");
			selection=["Tous"];
			gallery.innerHTML="";
			creationCard(projets);
		} else {
			const projetsFiltrees = projets.filter(function(element){
				return selection.includes(element.category.name);
				});
			gallery.innerHTML="";
			creationCard(projetsFiltrees);
		}
	})
}