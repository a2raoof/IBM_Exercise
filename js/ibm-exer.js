// JavaScript Document

var page = 1;
var loading = false;
var nListener = false;
var pListener = false;


window.addEventListener('load', function() {
	var header =  document.getElementById('header-id');
    var appContainer = document.getElementById('app-container');
	var toolbar = document.getElementById('toolbar-id');
	
	var gridButton = toolbar.querySelector('.gridIcon');
	var listButton = toolbar.querySelector('.listIcon');
	
	var xmlhttp = new XMLHttpRequest();

	var API_KEY = "a5e95177da353f58113fd60296e1d250";
var NASA_ID = "24662369@N07";
	var URL = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + 
	API_KEY + "&user_id=" + NASA_ID + "&format=json&nojsoncallback=1&per_page=10&page=" + page;
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if (loading == false){
				var myArr = JSON.parse(xmlhttp.responseText);
				fillContent(myArr, appContainer);
				loading = true;
			}
		}
	};
	xmlhttp.open("GET", URL, true);
	xmlhttp.send();
	
});

function fillContent(json, container) {
	
	var nextButton = document.getElementById('next-id');
	var prevButton = document.getElementById('prev-id');
	var pageIndicator = document.getElementById('page-id');
	pageIndicator.innerHTML = "| " + page + " |";
	
	if (nListener == false) {
		nextButton.addEventListener('click', function() {
			if (loading == false && page < parseInt(json.photos.pages)) {
				page++;
				var API_KEY = "a5e95177da353f58113fd60296e1d250";
				var NASA_ID = "24662369@N07";
				var URL = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + 
				API_KEY + "&user_id=" + NASA_ID + "&format=json&nojsoncallback=1&per_page=10&page=" + page;
				console.log("next");
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						var myArr = JSON.parse(xmlhttp.responseText);
						fillContent(myArr, container);
					}
				};
				xmlhttp.open("GET", URL, true);
		xmlhttp.send();
				
			}
	
		});
		nListener = true;
	}
	
	if (pListener == false) {
		prevButton.addEventListener('click', function() {
			if (loading == false && page > 1) {
				page--;
				var API_KEY = "a5e95177da353f58113fd60296e1d250";
				var NASA_ID = "24662369@N07";
				var URL = "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + 
				API_KEY + "&user_id=" + NASA_ID + "&format=json&nojsoncallback=1&per_page=10&page=" + page;
				console.log("prev");
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						var myArr = JSON.parse(xmlhttp.responseText);
						fillContent(myArr, container);
					}
				};
				xmlhttp.open("GET", URL, true);
				xmlhttp.send();
				
			}
		});
		pListener = true;
	}
	
	while(container.hasChildNodes()) {
		container.removeChild(container.firstChild);	
	}
	
	var xmlReqs = [];
	for (var j=0; j<json.photos.photo.length; j++) {
		
		var pic = json.photos.photo[j];
		var API_KEY = "a5e95177da353f58113fd60296e1d250";
		var PIC_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + 
API_KEY + "&photo_id=" + pic.id + "&format=json&nojsoncallback=1";

		
		
		var imageDiv = document.createElement('div');
		imageDiv.id = pic.id;
		imageDiv.classList.add("gridView");
		var imageTemplate = document.getElementById('image-template');
		imageDiv.appendChild(document.importNode(imageTemplate.content, true));
		var fileName = imageDiv.querySelector('.fileName');
		fileName.innerHTML = pic.title;
		
		var picture = imageDiv.querySelector('.picture');
		picture.src = 'https://farm' + pic.farm + '.staticflickr.com/' + pic.server + '/' + pic.id + '_' + pic.secret + '.jpg';
		
		
		xmlReqs[j] = new XMLHttpRequest();
		
		xmlReqs[j].open("GET", PIC_URL, true);
		xmlReqs[j].onreadystatechange = function() {
			if (this.readyState == 4) {
				var myArr = JSON.parse(this.responseText);
				popData(myArr);
			}
		};
		xmlReqs[j].send();
		
		container.appendChild(imageDiv);
	}
}

function popData(picJson) {
	var container = document.getElementById(picJson.photo.id);
	var modDate = container.querySelector('.modDate');
	var d = new Date(parseInt(picJson.photo.dateuploaded)*1000);
	modDate.innerHTML += d.toLocaleString();
	var location = container.querySelector('.picLocation');
	
	var picture = container.querySelector('.picture');
	picture.alt = picJson.photo.description._content;
	picture.addEventListener('click', function() {
		var fullImageDiv = document.createElement('div');
		fullImageDiv.classList.add("fullImageContainer");
		var fullImageTemplate = document.getElementById('full-image');
		fullImageDiv.appendChild(document.importNode(fullImageTemplate.content, true));
		var bigPicture = fullImageDiv.querySelector('.fullSizeImage');
		var source = this.src;
		bigPicture.src = source.replace('.jpg', '_b.jpg');
		
		var picName = fullImageDiv.querySelector('.picDesc');
		var text = this.alt;

		if (text.length > 2000) {
			text = text.substr(0,2000) + '...';
		}
		picName.innerHTML = text;
		
		document.body.appendChild(fullImageDiv);
		
		fullImageDiv.addEventListener('click', function() {
			this.parentNode.removeChild(this);
		});
	});
	loading = false;
}

function searchQuery() {
	document.getElementById('page-nav').style.display="none";
	document.getElementById('results-text').style.display="block";
	var searchWord = document.getElementById('search-word').value;
	var tag = false;
	if (document.getElementById('tag-radio').checked) {
		tag = true;
	}
	
	var API_KEY = "a5e95177da353f58113fd60296e1d250";
	var NASA_ID = "24662369@N07";
	var URL = "";
	if (tag) {
		URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + 
		API_KEY + "&user_id=" + NASA_ID + "&tags=" + searchWord + "&format=json&nojsoncallback=1&per_page=30";
	} else {
		URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + 
		API_KEY + "&user_id=" + NASA_ID + "&text='" + searchWord + "'&format=json&nojsoncallback=1&per_page=30";
	}
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			fillContent(myArr, document.getElementById('app-container'));
			//console.log(JSON.stringify(myArr));
		}
	};
	xmlhttp.open("GET", URL, true);
	xmlhttp.send();
	
	
	
}