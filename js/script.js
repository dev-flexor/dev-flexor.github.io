'use strict';

window.onload = function(){
	
	s.loadPeage();	
	
	/*const appId = 'dev.flexor.writestore'; // замініть на ваш ідентифікатор додатку
	const url = `https://play.google.com/store/apps/details?id=${appId}`;

	// Використання Fetch API для отримання HTML сторінки
	fetch(url)
	  .then(response => response.text())
	  .then(html => {
		// Створюємо парсер для HTML
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		
		// Отримання назви додатку
		const title = doc.querySelector('h1 span').innerText;
		
		// Отримання рейтингу додатку
		const rating = doc.querySelector('div.BHMmbe').innerText;

		// Отримання кількості завантажень
		const downloads = doc.querySelector('div span[class="htlgb"]').innerText;

		console.log('Назва:', title);
		console.log('Рейтинг:', rating);
		console.log('Завантажень:', downloads);
	  })
	  .catch(error => console.error('Помилка:', error));*/
	
};

var s = {
	
	peage : 'index.html',

	titles : {index : 'Home', notes : 'Notes', games : 'Games'},

	stylesScripts : {index : ['index'], notes : ['notes'], games : ['games']},
	
	gpUrl : 'https://play.google.com/store/apps/dev?id=6860317347778875449',
	
	initNav : function(){
		
		window.onpopstate = () => {
			this.loadNav();
			
			this.loadContent();		
		};				
	},
	
	loadNav : function(){
		let href = location.pathname;
		this.peage = href.length == 1 ? 'index.html': href.slice(1);
		let nav = document.querySelector('.wrap_nav nav');
		let active = nav.querySelector('.active_btn');	
		if(active) active.classList.remove('active_btn');
		nav.querySelector(`a[href='${this.peage}']`).classList.add('active_btn');
	},
	
	loadContent : function(){	
		fetch('content/'+this.peage).then(function(response){
			return response.text();
		})
		.then(function(response){								
			let section = document.querySelector('body section');
			section.innerHTML = response;
		});	

		const dotIndex = this.peage.lastIndexOf('.');
		let resP = 'index';
		if (dotIndex != -1) resP = this.peage.substring(0, dotIndex);

		document.title = this.titles[resP];
		this.loadStyleScript();
	},
	
	loadPeage : function(){
		fetch('views/footer.html').then(function(response){
			return response.text();
		})
		.then(function(response){				
			let footer = document.querySelector('body footer');
			footer.innerHTML = response;
		});
		
		
		fetch('views/header.html').then(function(response){
			return response.text();
		})
		.then((response) => {								
			let header = document.querySelector('body header');
			header.innerHTML = response;
			
			this.initNav();
			this.loadNav();
			this.loadContent();
			this.initClick();		
		});
	},
	
	initClick : function(){
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
		
		document.querySelector('.wrap_header .wrap_gp_logo').onclick = function(e){
			window.open(self.gpUrl, "_blank");
		};
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