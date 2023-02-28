import {buttonAllClicked,buttonClicked} from "./filters.js";

const all="Tous";
let filters;
let projects;
const gallery = document.querySelector(".gallery");
const filterContainer = document.createElement("div");
filterContainer.classList.add("filters");
gallery.parentElement.insertBefore(filterContainer,gallery);
await dataFiltersLoading();
await dataProjectsLoading();
await creationFilter();
creationCard(projects);
buttonAllClicked(projects);
buttonClicked(projects);
login();
let token = window.localStorage.getItem("token");
if(token !== null){
	editionMode();
	logout();
}

async function dataFiltersLoading(){
	filters = window.localStorage.getItem("filters");
	// Filter list creation from the categorie loading from the API, if not in the LocalStorage
	if (filters === null){
		try{
			const answer = await fetch("http://localhost:5678/api/categories");
			const categories = await answer.json();
			//creation of the filter list from the API
			filters = categories.map(function(a){
				return a.name;
			});
			//add of the filter "all" in the filter list
			filters.unshift(all);
			//upload of the filter list in the localStorage
			const filtersValue = JSON.stringify(filters);
			window.localStorage.setItem("filters",filtersValue);
		}
		catch(error){
			console.log(error);
		}
	}else{
		filters = JSON.parse(filters);
	};
	return filters;
}

async function dataProjectsLoading(){
	projects = window.localStorage.getItem("projects");
	//Project content loading from the API, if not in the LocalStorage
	if (projects === null){
		try{
		const answer = await fetch("http://localhost:5678/api/works");
		projects = await answer.json();
		console.log(projects);
		const projectsValue = JSON.stringify(projects);
		window.localStorage.setItem("projects", projectsValue);
		}
		catch(error){
			console.log(error);
		}
	}else{
		projects = JSON.parse(projects);
	};
	return projects;
}

//Function to Create all filter buttons on the HTML page (based on one list of category)
async function creationFilter(){
	await dataFiltersLoading();
	//creation of all the filters from the filter list
	for(let i in filters){
		const button = document.createElement("button");
		button.innerText=filters[i];
		button.classList.add("button");
		filterContainer.appendChild(button);
		button.dataset.id=filters[i];
	}
	const buttonAll = document.querySelector(".filters button");
	buttonAll.classList.add("buttonAll");
	buttonAll.classList.add("selected");
}

//Function to Create all card project on the HTML page (based on one list of project) 
export async function creationCard(list){
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
	const loginLink = document.querySelector(".login");
	loginLink.innerHTML="logout";
	loginLink.classList.replace("login","logout");
}

function login(){
	const btnLogin = document.querySelector(".login");
	btnLogin.addEventListener("click",function(event){
		document.location.href="./login.html";
	});
}

function logout(){
    const logoutButton = document.querySelector(".logout");
    logoutButton.addEventListener("click",function(){
        localStorage.removeItem("token");
        document.location.href="./index.html";
    })
}