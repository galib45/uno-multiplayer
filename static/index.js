const startButton = document.getElementById('start-game');
const svgData = document.querySelector('div#svg-data');
const gameArea = document.getElementById('game');
const commonArea = document.getElementById('commonArea');
const playerArea = document.getElementById('playerArea');

const socket = io.connect("/");
let initialized = false;
let player;
let started = 0;

startButton.onclick = () => {
	socket.emit('start', started);
};

socket.on("connect", () => {
	console.log(socket.id);
	document.getElementById('ui').style.visibility = 'visible';
	document.getElementById('greetings').innerHTML = "Welcome to the room!";
	fetch('/static/data.svg')
		.then((response) => response.text())
		.then((text) => {
			svgData.innerHTML = text;
		});
});

socket.on("disconnect", () => {
	console.log('disconnected');
});

socket.on("update", (players) => {
	console.log('update');
	if(players.length >= 2) startButton.style.visibility = 'visible';
	else startButton.style.visibility = 'hidden';
	if (started == 0) gameArea.style.visibility = 'hidden';
	player = localStorage.getItem("player");
	let playerList = document.getElementById('players-list');
	playerList.innerHTML = "";
	for (item of players) {
		if (item == player) playerList.innerHTML += '<div class="list-item bold">' + item + '</div>';
		else playerList.innerHTML += '<div class="list-item">' + item + '</div>';
	}
	console.log(player);
	console.log(players);
});

socket.on("init", (players) => {
	started = 0;
	if (initialized == false) {
		console.log('init');
		player = localStorage.getItem("player");
		if (player == null) {
			player = prompt("Please enter your name");
			while (players.includes(player)) {
				player = prompt("The name " + player + " is already in use. Please enter a different name");
			}
			socket.emit("enter", player);
		} else {
			if (confirm("You are playing as " + player) == false) {
				if (players.includes(player)) {
					players.splice(players.indexOf(player), 1);
					socket.emit("leave", player);
				}
				player = prompt("Please enter your name");
				while (players.includes(player)) {
					player = prompt("The name " + player + " is already in use. Please enter a different name");
				}
				socket.emit("enter", player);
			} else {
				if (players.includes(player) == false) {
					socket.emit("enter", player);
				} else {
					socket.emit("reload");
				}
			}
		}
		console.log(player);
		console.log(players);
		localStorage.setItem("player", player);
		initialized = true;
	}
});


socket.on("distribute", (players, deck) => {
	started = 1;
	z = deck.length;
	console.log(deck);
	startButton.style.visibility = 'hidden';
	gameArea.style.visibility = 'visible';
	deck.forEach( (card, idx) => {
		setTimeout(() => {
			let img = document.createElement('img');
			let backimg = document.createElement('img');
			img.setAttribute('src', createSVG(card));
			backimg.setAttribute('src', backsrc);
			
			let flipcard = document.createElement('div');
			flipcard.classList.add('flip-card');
			let flipcardinner = document.createElement('div');
			flipcardinner.classList.add('flip-card-inner');
	
			let flipcardfront = document.createElement('div');
			flipcardfront.classList.add('flip-card-front');
			flipcardfront.innerHTML += img.outerHTML;
			let flipcardback = document.createElement('div');
			flipcardback.classList.add('flip-card-back');
			flipcardback.innerHTML += backimg.outerHTML;
	
			flipcardinner.appendChild(flipcardfront);
			flipcardinner.appendChild(flipcardback);
	
			flipcard.appendChild(flipcardinner);
			// console.log(flipcard);
			flipcard.style.zIndex = z;
			z -= 1;
			commonArea.appendChild(flipcard);
		}, idx*50);
	});
});
