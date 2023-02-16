let projets = window.localStorage.getItem("projets");
let filtres =window.localStorage.getItem("filtres");
// let filtress = [];

//Project content loading from the API, if not in the LocalStorage
if (projets === null){
	// Récupération des pièces depuis l'API
	const reponse = await fetch("http://localhost:5678/api/works");
	projets = await reponse.json();
	
	//extration of data to creat the filter list
	filtres=["Tous"];
	let filtresList = projets.map(function(a){
		return a.category.name
	})
	console.log(filtresList);
	for (let i in filtresList){
		if(filtres.includes(filtresList[i])){}
		else{
			filtres.push(filtresList[i]);
		}
	}
	console.log(filtres);
	// Transformation des filtres en JSON
	const valeurFiltres = JSON.stringify(filtres);
	// Stockage des informations dans le localStorage
	window.localStorage.setItem("filtres",valeurFiltres);


	// Transformation des pièces en JSON
	const valeurProjets = JSON.stringify(projets);
	// Stockage des informations dans le localStorage
	window.localStorage.setItem("projets", valeurProjets);
}else{
	projets = JSON.parse(projets);
	filtres = JSON.parse(filtres);
};

// Filter list creation from the categorie loading from the API, if not in the LocalStorage
// if (filtres === null){
// 	const reponse = await fetch("http://localhost:5678/api/categories");
// 	const categories = await reponse.json();
// 	//creation of the filter list from the API
// 	filtres = categories.map(function(a){
// 		return a.name;
// 	});
// 	//add of the filter "tous" in the filter list
// 	filtres.unshift("Tous");
// 	//upload of the filter list in the localStorage
// 	const valeurFiltres = JSON.stringify(filtres);
// 	window.localStorage.setItem("filtres",valeurFiltres);
// }else{
// 	filtres = JSON.parse(filtres);
// };
// console.log(filtres);


//Function to Create all filter buttons on the HTML page (based on one list of category)
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

//Function to Create all card project on the HTML page (based on one list of project) 
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

creationCard(projets);
creationFilter(filtres);

//initialisation of the selection list when the page is loading
let selection = ["Tous"];

//Actions when the "Tous" button is clicked
const bouton_tous=document.querySelector(".bouton_tous");
bouton_tous.addEventListener("click",function(){
	if(selection[0]!=="Tous"){
		
		// unselection of all the other filters when the "Tous" button is clicked
		for(let i in selection){
			const sel = document.querySelector(`button[data-id="${selection[i]}"]`);
			sel.classList.toggle("selected");
		}
		selection=["Tous"];
		gallery.innerHTML="";
		creationCard(projets);
		bouton_tous.classList.toggle("selected");
	}
	//no else
});

//Actions when all buttons (except "Tous") are clicked
const  bouton_trier = document.querySelectorAll(".bouton");
for (let i=1;i<bouton_trier.length;i++){
	bouton_trier[i].addEventListener("click",function(event){
		event.target.classList.toggle("selected");

		//writting of the selection list (if the "Tous" button is on or not)
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
		
		//Reload of all the project which match the selection list (if the filters are all unselected or not)
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