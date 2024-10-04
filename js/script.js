'use strict';

window.onload = function(){
	
	s.loadPeage();	
};

var s = {
	
	peage : 'index.html',

	titles : {index : 'Home', notes : 'Notes', games : 'Games'},

	stylesScripts : {index : ['index'], notes : ['notes'], games : ['games']},
	
	initNav : function(){
		
		window.onpopstate = () => {
			this.loadNav();
			
			this.loadContent();		
		};	
		
		var self = this;
		var click = function(e){			
			if(!this.classList.contains('active_btn')){
								
				document.querySelector('.wrap_nav nav .active_btn').classList.remove('active_btn');
				this.classList.add('active_btn');
				
				self.peage = this.getAttribute('href');
				history.pushState(null, null, self.peage);

				self.loadContent();
			}
			
			e.preventDefault();
		};
		
		let a = document.querySelectorAll('.wrap_nav nav a');
		for(let v of a) v.onclick = click;			
	},
	
	loadNav : function(){
		let href = location.pathname;console.log(href.slice(1));
		this.peage = href.length == 1 ? 'index.html': href.slice(1);
		let nav = document.querySelector('.wrap_nav nav');
		let active = nav.querySelector('.active_btn');	
		if(active) active.classList.remove('active_btn');
		nav.querySelector('a[href="'+this.peage+'.html"]').classList.add('active_btn');		
	},
	
	loadContent : function(){	
		fetch('content/'+this.peage).then(function(response){
			return response.text();
		})
		.then(function(response){								
			let section = document.querySelector('body section');
			section.innerHTML = response;
		});	

		document.title = this.titles[this.peage];
		this.loadStyleScript();
	},

	
	loadPeage : function(){
		fetch('views/footer').then(function(response){
			return response.text();
		})
		.then(function(response){				
			let footer = document.querySelector('body footer');
			footer.innerHTML = response;
		});
		
		
		fetch('views/header').then(function(response){
			return response.text();
		})
		.then((response) => {								
			let header = document.querySelector('body header');
			header.innerHTML = response;
			
			this.initNav();
			this.loadNav();
			this.loadContent();
		});
	},

	loadStyleScript : function(){
		this.removeOldTags();
		let dotIndex = this.peage.lastIndexOf('.');
		let res = this.peage.substring(0, dotIndex);
		
		var arrLinks = this.stylesScripts[res];
		for (let element of arrLinks) {
		    console.log(element);

		    let linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.classList = 'loaded';
			linkElement.href = 'css/' + element + '.css';

			document.head.appendChild(linkElement);

			let scriptElement = document.createElement('script');
			scriptElement.type = 'text/javascript';			
			scriptElement.src = 'js/' + element + '.js';
			scriptElement.classList = 'loaded';
			scriptElement.onload = function() {
			    // Використання об'єктів і методів з завантаженого скрипта
			    if (typeof myFunction === 'function') {
			        myFunction(); // Виклик функції з завантаженого скрипта
			    }
			};

			document.head.appendChild(scriptElement);
		}
	},

	removeOldTags : function(){
		var elements = document.head.getElementsByClassName('loaded');
		var elementsArray = Array.from(elements);
		for (let element of elementsArray) 
			element.parentNode.removeChild(element);
	}
};
