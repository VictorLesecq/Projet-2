import {buttonAllClicked,buttonClicked} from "./filters.js";

const all="Tous";
let filters;
let projects;
let gallery = document.querySelector(".gallery");
const filterContainer = document.createElement("div");
filterContainer.classList.add("filters");
gallery.parentElement.insertBefore(filterContainer,gallery);
await dataFiltersLoading();
await dataProjectsLoading();
await creationFilter();
creationCard(projects,1);
buttonAllClicked(projects);
buttonClicked(projects);
// login();
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
export async function creationCard(list,boolean){
	for (let i in list){
		const figure = document.createElement("figure");
		gallery.appendChild(figure);
		const imageElement = document.createElement("img");
		imageElement.src = list[i].imageUrl;
		imageElement.alt = list[i].title;
		figure.appendChild(imageElement);
		const figCaption = document.createElement("figcaption");
		if(boolean){
			figCaption.innerText = list[i].title;
		}else{
			figCaption.innerHTML = "<a href='#'>éditer</a>"
			const trash=document.createElement("button");
			trash.classList.add("trashcan");
			trash.innerHTML="<i class='fa-solid fa-trash-can'></i>";
			figure.appendChild(trash);
		}
		figure.appendChild(figCaption);;
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
	const intro = document.querySelector("#introduction");
	const portfolio = document.querySelector("#portfolio");
	const firstPlaceContainer = intro.firstElementChild;
	const secondPlaceContainer = intro.firstElementChild.nextElementSibling;
	const thirdPLaceContainer = portfolio.firstElementChild;
	let modifTopicContainer = [firstPlaceContainer,secondPlaceContainer,thirdPLaceContainer];
	for (let i in modifTopicContainer){
		modifInfo.innerHTML=`<p><i class='fa-regular fa-pen-to-square'></i><a href='#modal${i}' class='js-modal'>modifier</a></p>`;
		let elem = modifInfo.cloneNode(true);
		elem.classList.add(`modifInfo-${i}`);
		modifTopicContainer[i].insertBefore(elem,modifTopicContainer[i].firstElementChild);
	};

	//transformation of the link login to logout
	const loginLink = document.querySelector(".login");
	loginLink.innerHTML="logout";
	loginLink.classList.replace("login","logout");
}

// function login(){
// 	const btnLogin = document.querySelector("a[href='./login.html']");
// 	btnLogin.addEventListener("click",function(event){
// 		document.location.href="./login.html";
// 	});
// }

function logout(){
    const btnLogout = document.querySelector(".logout");
    btnLogout.addEventListener("click",function(e){
		e.preventDefault()
        localStorage.removeItem("token");
        document.location.href="./index.html";
    })
}


let modal=null;
modificationProject();

function modificationProject(){
	const btnModal= document.querySelectorAll(".js-modal");
	btnModal.forEach(a=> {a.addEventListener("click",openModal);
})};

function openModal(event){
	event.preventDefault();
	try{
		const target=document.querySelector(event.target.getAttribute("href"));
		target.style.display=null;
		target.removeAttribute("aria-hidden");
		target.setAttribute("aria-modal","true");
		gallery=document.querySelector(".modal .gallery");
		creationCard(projects,0);
		gallery=document.querySelector(".gallery");
		modal=target;
		modal.addEventListener("click",closeModal);
		modal.querySelector(".js-close-modal").addEventListener("click",closeModal);
		modal.querySelector(".js-stop-modal").addEventListener("click",stopPropagation);
	}
	catch(error){
		console.log(error);
	}
}

function closeModal(event){
	if(modal===null) return;
	event.preventDefault();
	modal.style.display="none";
	modal.setAttribute("aria-hidden","true");
	modal.removeAttribute("aria-modal");
	// to delete the gallery content only on the modal which contain projects
	if(document.querySelector(".modal .gallery")){
		document.querySelector(".modal .gallery").innerHTML="";
	}
	gallery=document.querySelector(".gallery");
	modal.removeEventListener("click",closeModal);
	modal.querySelector(".js-close-modal").removeEventListener("click",closeModal);
	modal.querySelector(".js-stop-modal").removeEventListener("click",stopPropagation);
	modal=null;
}

function stopPropagation(event){
	event.stopPropagation();
}



