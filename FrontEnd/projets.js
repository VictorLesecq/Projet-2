import {buttonAllClicked,buttonClicked} from "./filters.js";

let projects = window.localStorage.getItem("projects");
let filters =window.localStorage.getItem("filters");
const all="Tous";
dataProjectsLoading();
// dataFiltersLoading();

// async function dataFiltersLoading(){
// Filter list creation from the categorie loading from the API, if not in the LocalStorage
if (filters === null){
	// const answer = await fetch("http://localhost:5678/api/categories");
	// const categories = await answer.json();
	const categories= await fetch("http://localhost:5678/api/categories")
		.then(data=>data.json())
		.catch(function(){
			alert("Problème de connexion avec le serveur, veuillez rafraichir la page")
		});

	//creation of the filter list from the API
	filters = categories.map(function(a){
		return a.name;
	});
	//add of the filter "all" in the filter list
	filters.unshift(all);
	//upload of the filter list in the localStorage
	const filtersValue = JSON.stringify(filters);
	window.localStorage.setItem("filters",filtersValue);
}else{
	filters = JSON.parse(filters);
};
// }

const gallery = document.querySelector(".gallery");
const filterContainer = document.createElement("div");
filterContainer.classList.add("filters");
gallery.parentElement.insertBefore(filterContainer,gallery);
creationCard(projects);
creationFilter(filters);
let selection=[all];
buttonAllClicked(projects);
buttonClicked(projects);

let token = window.localStorage.getItem("token");
if(token !== null){
editionMode();
functionLogout();
}

async function dataProjectsLoading(){
//Project content loading from the API, if not in the LocalStorage
if (projects === null){
	const answer = await fetch("http://localhost:5678/api/works");
	projects = await answer.json();
	console.log(projects);
	const projectsValue = JSON.stringify(projects);
	window.localStorage.setItem("projects", projectsValue);
}else{
	projects = JSON.parse(projects);
};
}

//Function to Create all filter buttons on the HTML page (based on one list of category)
function creationFilter(list){	
	console.log(list);
	//creation of all the filters from the filter list
	for(let i in list){
		const button = document.createElement("button");
		button.innerText=list[i];
		button.classList.add("button");
		filterContainer.appendChild(button);
		button.dataset.id=list[i];
	}
	const buttonAll = document.querySelector(".filters button");
	buttonAll.classList.add("buttonAll");
	buttonAll.classList.add("selected");
}

//Function to Create all card project on the HTML page (based on one list of project) 
export function creationCard(list){
	for (let i in list){
		const figure = document.createElement("figure");
		gallery.appendChild(figure);
		const imageElement = document.createElement("img");
		imageElement.src = list[i].imageUrl;
		imageElement.alt = list[i].title;
		figure.appendChild(imageElement);
		const figCaption = document.createElement("figcaption");
		figCaption.innerText = list[i].title;
		figure.appendChild(figCaption);
	}
}

function editionMode(){
	//Creation of the top tape 
	const html = document.querySelector("html");
	const tape = document.createElement("div");
	tape.classList.add("editionModeTape");
	tape.innerHTML="<p><i class='fa-regular fa-pen-to-square'></i>Mode Edition</p><input type='submit' id='changeValidation' value='publier les changements'>";
	html.insertBefore(tape,html.firstChild.nextSibling);

	//Add of all the link to modify the element
	const modifInfo = document.createElement("div");
	modifInfo.innerHTML="<p><a href='#'><i class='fa-regular fa-pen-to-square'></i>modifier</a></p>";
	const intro = document.querySelector("#introduction");
	const portfolio = document.querySelector("#portfolio");
	const firstPlaceContainer = intro.firstElementChild;
	const secondPlaceContainer = intro.firstElementChild.nextElementSibling;
	const thirdPLaceContainer = portfolio.firstElementChild;
	let modifTopicContainer = [firstPlaceContainer,secondPlaceContainer,thirdPLaceContainer];
	for (let i in modifTopicContainer){
		let elem = modifInfo.cloneNode(true);
		elem.classList.add(`modifInfo-${i}`);
		modifTopicContainer[i].insertBefore(elem,modifTopicContainer[i].firstElementChild);
	};

	//transformation of the link login to logout
	const loginLink = document.querySelector("a[href='./login.html']");
	loginLink.innerHTML="logout";
	loginLink.classList.add("logout");
}

function functionLogout(){
    const logoutButton = document.querySelector(".logout");
    logoutButton.addEventListener("click",function(){
        localStorage.removeItem("token");
        document.location.href="./index.html";
    })
}
// function buttonAllClicked(projects){
// 	const buttonAll=document.querySelector(".buttonAll");
// 	buttonAll.addEventListener("click",function(){
// 		if(selection[0]!==all){
// 			// unselection of all the other filters when the "all" button is clicked
// 			for(let i in selection){
// 				const sel = document.querySelector(`button[data-id="${selection[i]}"]`);
// 				sel.classList.toggle("selected");
// 			}
// 			selection=[all];
// 			gallery.innerHTML="";
// 			creationCard(projects);
// 			buttonAll.classList.toggle("selected");
// 		}
// 		//nothing else if the "All" button is already selected
// 	});
// }

// function buttonClicked(projects){
// 	//Actions when all buttons (except "all") are clicked
// 	const sortedButton = document.querySelectorAll(".button");
// 	const buttonAll=document.querySelector(".buttonAll");
// 	for (let i=1;i<sortedButton.length;i++){
// 		sortedButton[i].addEventListener("click",function(event){
// 			event.target.classList.toggle("selected");
// 			//writting of the selection list (if the "all" button is on or not)
// 			if(selection[0]===all){
// 				selection=[];
// 				selection.push(event.target.innerText);
// 				buttonAll.classList.toggle("selected");
// 			} else {
// 				if(selection.includes(event.target.innerText)){
// 					selection.splice(selection.indexOf(event.target.innerText),1);
// 				} else {
// 				selection.push(event.target.innerText);
// 				}
// 			}
// 			//Reload of all the project which match the selection list (if the filters are all unselected or not)
// 			if(selection.length===0){
// 				buttonAll.classList.toggle("selected");
// 				selection=[all];
// 				gallery.innerHTML="";
// 				creationCard(projects);
// 			} else {
// 				const sortedProjects = projects.filter(function(element){
// 					return selection.includes(element.category.name);
// 				});
// 				gallery.innerHTML="";
// 				creationCard(sortedProjects);
// 			}
// 		})
// 	}
// }