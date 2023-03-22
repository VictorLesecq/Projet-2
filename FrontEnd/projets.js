import {buttonAllClicked,buttonClicked,displaySelection} from "./filters.js";

const all="Tous";
let filters;
let projects;
let gallery = document.querySelector(".gallery");
const filterContainer = document.createElement("div");
filterContainer.classList.add("filters");
gallery.parentElement.insertBefore(filterContainer,gallery);
await dataProjectsLoading();
await filterDataUse();
creationCard(projects,true);
buttonAllClicked();
buttonClicked();

let token = window.localStorage.getItem("token");
if(token !== null){
	editionMode();
	logout();
}

let modal=null;
openModalEventListener();


async function filterDataUse(){
	await creationFilter();
	addFilterToForm();
}

//Function to Create all filter buttons on the HTML page (based on one list of category)
async function creationFilter(){
	await dataFiltersLoading();
	//creation of all the filters from the filter list
	for(let i in filters){
		const button = document.createElement("button");
		button.innerText=filters[i];
		button.classList.add("btn");
		button.classList.add("btn-filter");
		filterContainer.appendChild(button);
		button.dataset.id=filters[i];
	}
	const buttonAll = document.querySelector(".filters button");
	buttonAll.classList.add("buttonAll");
	buttonAll.classList.add("selected");
}

async function dataFiltersLoading(){
	filters = window.localStorage.getItem("filters");
	// Filter list creation from the categorie loading from the API, if not in the LocalStorage
	if (filters === null){
		try{
			const answer = await fetch("http://localhost:5678/api/categories");
			const categories = await answer.json();
			console.log(categories);
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

function addFilterToForm(){
	const form = document.querySelector("#modal3 form");
	form.innerHTML+=`<label class='label-nw-project' for='category-nw-project'>Catégorie</label>
					<select id='category-nw-project' name='category-nw-project'>
						<option hidden disabled selected value> -- sélectionner une catégorie -- </option>
					</select>
					`;
	const dropDownList = form.querySelector("select");
	for(let i=1;i<filters.length;i++){
		dropDownList.innerHTML+=`<option value="${filters[i]}">${filters[i]}</option>`;
	};
	form.innerHTML+=`<div class='thin-border-bottom'></div>
					<button class="button add-picture-button">Valider</button>`;
}

async function dataProjectsLoading(){
	projects = window.localStorage.getItem("projects");
	//Project content loading from the API, if not in the LocalStorage
	if (projects === null){
		try{
		const answer = await fetch("http://localhost:5678/api/works");
		projects = await answer.json();
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


//Function to Create all card project on the HTML page (based on one list of project) 
export async function creationCard(list,isNotModal){
	for (let i in list){
		const figure = document.createElement("figure");
		figure.dataset.idProject=list[i].id;
		gallery.appendChild(figure);
		const imageElement = document.createElement("img");
		imageElement.src = list[i].imageUrl;
		imageElement.alt = list[i].title;
		figure.appendChild(imageElement);
		const figCaption = document.createElement("figcaption");
		if(isNotModal){
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
	tape.innerHTML=`<p><i class='fa-regular fa-pen-to-square'></i>Mode Edition</p>
					<input type='submit' class="btn" id='changeValidation' value='publier les changements'>`;
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
		modifInfo.innerHTML=`<p>
								<i class='fa-regular fa-pen-to-square'></i>
								<a href='#modal${i}' class='js-modal' data-link-reference='#modal${i}'>modifier</a>
							</p>`;
		let elem = modifInfo.cloneNode(true);
		elem.classList.add(`modifInfo-${i}`);
		modifTopicContainer[i].insertBefore(elem,modifTopicContainer[i].firstElementChild);
	};

	//transformation of the link login to logout
	const loginLink = document.querySelector(".login");
	loginLink.innerHTML="logout";
	loginLink.classList.replace("login","logout");
}

function logout(){
    const btnLogout = document.querySelector(".logout");
    btnLogout.addEventListener("click",function(e){
		e.preventDefault()
        localStorage.removeItem("token");
        document.location.href="./index.html";
    })
}

function openModalEventListener(){
	const btnModifProject= document.querySelectorAll(".js-modal");
	btnModifProject.forEach(a=> {a.addEventListener("click",function(event){
		closeModal(event); //if a modal is already open
		openModal(event);
	});
})};

function openModal(event){
	event.preventDefault();
	try{
		const target=document.querySelector(event.target.dataset.linkReference);
		modal=target;
		modal.style.display=null;
		modal.removeAttribute("aria-hidden");
		modal.setAttribute("aria-modal","true");
		modal.addEventListener("click",closeModal);
		modal.querySelector(".js-close-modal").addEventListener("click",closeModal);
		modal.querySelector(".js-stop-modal").addEventListener("click",stopPropagation);
		if(modal.querySelector(".gallery")){
			gallery=document.querySelector(".modal .gallery");
			creationCard(projects,false);
			gallery=document.querySelector(".gallery");
			eventListenerDeleteProject();
		}else{
			eventListenerAddProject();
		};
	}
	catch(error){
		console.log(error);
	}
}

function closeModal(){
	if(modal===null) {
		return;
	}else{
		modal.style.display="none";
		modal.setAttribute("aria-hidden","true");
		modal.removeAttribute("aria-modal");
		// to delete the gallery content only on the modal which contain projects
		if(modal.querySelector(".gallery")){
			modal.querySelector(".gallery").innerHTML="";
			removeEventListenerDeleteProject();
		}else{
			removeEventListenerAddProject();
		}
		gallery=document.querySelector(".gallery");
		modal.removeEventListener("click",closeModal);
		modal.querySelector(".js-close-modal").removeEventListener("click",closeModal);
		modal.querySelector(".js-stop-modal").removeEventListener("click",stopPropagation);
		modal=null;
	}
}

function stopPropagation(event){
	event.stopPropagation();
}

function eventListenerDeleteProject(){
	document.querySelectorAll(".trashcan").forEach(a=> {a.addEventListener("click", deleteOneProject)});
	document.querySelector(".suppGallery").addEventListener("click",deleteAllProject);
}

async function deleteOneProject(e){
		let idDeletedProj=e.target.parentElement.parentElement.getAttribute("data-id-project");;
		if(await deleteProjectOnBDD(idDeletedProj)){
			deleteProjectOnModal(idDeletedProj);
			alert("Le projet a été supprimé avec succès !")
			// closeModal();
			displaySelection();
		}else{
			alert("une erreur est survenue lors de la suppression du projet.");
		}
}

function deleteAllProject(){
	// let listIdProject=document.querySelectorAll(".trashcan").map( a=> a.parentElement.getAttribute("data-id-project"));
	let listIdProject=[];
	let count=0;
	document.querySelectorAll(".trashcan").forEach(a=>listIdProject.push(a.parentElement.getAttribute("data-id-project")))
	listIdProject.forEach(async function(a){
		if(deleteProjectOnBDD(a)){
			deleteProjectOnModal(a);
			count+=1;
		}
	})
	if(count===listIdProject.length){
		alert("Tous les projets ont été supprimés avec succès !")
	}else{
		alert("Tous les projects n'ont pas pu être supprimés correctement")
	}
	closeModal();
	displaySelection();
}

function deleteProjectOnModal(idDeletedElement){
	document.querySelector(`#modal2 figure[data-id-project='${idDeletedElement}']`).remove();
	let indexDeletedProject=projects.findIndex(elem=>elem.id == idDeletedElement);
	projects.splice(indexDeletedProject,1);
	const projectsValue = JSON.stringify(projects);
	window.localStorage.setItem("projects", projectsValue);
}

async function deleteProjectOnBDD(idDeletedElement){
	let tokenKey=getToken();
	if (tokenKey!==null){
		try{
			let response= await fetch('http://localhost:5678/api/works/' + idDeletedElement, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${tokenKey}`
				},
			})
			if (response.ok){
				return(response.ok);
			}else{
				return(response.ok);
			}
		}
		catch(error){
			console.log(response);
			alert(error.message);
		}
	}else{
		alert("Une erreur s'est produite, veillez-vous reconnecter");
        document.location.href="./login.html";
	}
}
function getToken(){
	let tokenKey=JSON.parse(window.localStorage.getItem("token"));
	return tokenKey;
}

function removeEventListenerDeleteProject(){
	document.querySelectorAll(".trashcan").forEach(a=> {a.removeEventListener("click")});
	document.querySelector(".suppGallery").removeEventListener("click",deleteAllProject);
}



function eventListenerAddProject(){
	const form = modal.querySelector("form");
	form.addEventListener("submit", eventListenerAddProjectEffect);
	form.addEventListener("change",changeButtonColor);
}

async function eventListenerAddProjectEffect(e){
		e.preventDefault();
		const form = modal.querySelector("form");
		let inputTitle = document.querySelector("#title-nw-project").value.trim();
		let inputCategory = document.querySelector("#category-nw-project").value;
		let inputIdCategory = filters.findIndex(elem => elem===inputCategory);
		let inputPicture = document.querySelector("#btn-add-picture").files[0];

		if(inputTitle && inputIdCategory && inputPicture){
			if(await postNewProjectOnBdd(inputTitle,inputIdCategory,inputPicture)){
				alert("Le projet a été ajouté avec succès !")
				//form reset
				const img =form.querySelector("#output");
				img.style.display="none";
				img.src=null;
				document.querySelector("#title-nw-project").value=null;
				document.querySelector("#category-nw-project").value=null;
				const input=form.querySelector("#input");
				input.style.display=null;
				document.querySelector(".add-picture-button").style.backgroundColor=null;
				localStorage.removeItem("projects");
				await dataProjectsLoading();
				closeModal();
				displaySelection();
			}else{
				alert("Une erreur s'est produite, veillez verifier et réessayer")
			}
			
		}else{
			alert("Le formulaire n'est pas complet, veuillez réessayer");
		}
}

function removeEventListenerAddProject(){
	const form = modal.querySelector("form");
	form.removeEventListener("submit",eventListenerAddProjectEffect);
	form.removeEventListener("change",changeButtonColor);
}

async function postNewProjectOnBdd(title,idCategory,picture){
	try{
		var formData = new FormData();
		formData.append("title",title);
		formData.append("category",idCategory);
		formData.append("image",picture);
		let tokenKey=getToken();
		let response = await fetch('http://localhost:5678/api/works/', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${tokenKey}`
			},
			body : formData
		})
		if(response.ok){
			return(response.ok);
		}else{
			return(response.ok);
		};
	}
	catch(error){
		console.log(response);
		alert(error.message);
	}
}

function changeButtonColor(){
	let inputTitle = document.querySelector("#title-nw-project").value.trim();
	let inputCategory = document.querySelector("#category-nw-project").value;
	let inputIdCategory = filters.findIndex(elem => elem===inputCategory);
	let inputPicture = document.querySelector("#btn-add-picture").files[0];
	
	if(inputTitle && inputIdCategory && inputPicture){
		document.querySelector(".add-picture-button").style.backgroundColor = "#1D6154";
	}
}