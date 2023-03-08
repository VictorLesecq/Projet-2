/* global Chart */
import { creationCard } from "./projets.js";
//Actions when the "all" button is clicked
const all ="Tous";
let selection=[all];

export function buttonAllClicked(projects){
	const buttonAll=document.querySelector(".buttonAll");
	buttonAll.addEventListener("click",function(){
		buttonAllEffect(projects)
	});
};

function buttonAllEffect(projects){	
	const buttonAll=document.querySelector(".buttonAll");
	const gallery = document.querySelector(".gallery");
	if(selection[0]!==all){
		// unselection of all the other filters when the "all" button is clicked
		for(let i in selection){
			const sel = document.querySelector(`button[data-id="${selection[i]}"]`);
			sel.classList.toggle("selected");
		}
		selection=[all];
		gallery.innerHTML="";
		creationCard(projects,true);
		buttonAll.classList.toggle("selected");
	}
	//nothing else if the "All" button is already selected
}

export function buttonClicked(projects){
	//Actions when all buttons (except "all") are clicked
	const sortedButton = document.querySelectorAll(".btn-filter");
	for (let i=1;i<sortedButton.length;i++){
		sortedButton[i].addEventListener("click",function(event){
			buttonEffect(event,projects)
		})
	}
}

function buttonEffect(event,projects){	
	const buttonAll=document.querySelector(".buttonAll");
	const gallery = document.querySelector(".gallery");
	event.target.classList.toggle("selected");
	//writting of the selection list (if the "all" button is on or not)
	if(selection[0]===all){
		selection=[];
		selection.push(event.target.innerText);
		buttonAll.classList.toggle("selected");
	} else {
		if(selection.includes(event.target.innerText)){
			selection.splice(selection.indexOf(event.target.innerText),1);
		} else {
		selection.push(event.target.innerText);
		}
	}
	//Reload of all the project which match the selection list (if the filters are all unselected or not)
	if(selection.length===0){
		buttonAll.classList.toggle("selected");
		selection=[all];
		gallery.innerHTML="";
		creationCard(projects,true);
	} else {
		const sortedProjects = projects.filter(function(element){
			return selection.includes(element.category.name);
		});
		gallery.innerHTML="";
		creationCard(sortedProjects,true);
	}
}