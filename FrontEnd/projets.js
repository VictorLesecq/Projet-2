import {buttonAllClicked,buttonClicked} from "./filters.js";

let projects = window.localStorage.getItem("projects");
let filters =window.localStorage.getItem("filters");
const all="Tous";
dataProjectsLoading();
// dataFiltersLoading();

// async function dataFiltersLoading(){
// Filter list creation from the categorie loading from the API, if not in the LocalStorage
if (filters === null){
	const answer = await fetch("http://localhost:5678/api/categories");
	const categories = await answer.json();
	// const categories= await fetch("http://localhost:5678/api/categories")
	// 	.then(data=>data.json());

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