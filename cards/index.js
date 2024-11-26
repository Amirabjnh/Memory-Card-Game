// Sélectionne l'élément HTML avec la classe "grid-container" et le stocke dans la variable gridContainer
const gridContainer = document.querySelector(".grid-container");

// Initialise un tableau vide cards qui sera utilisé pour stocker les cartes du jeu
let cards = [];

// Initialise deux variables firstCard et secondCard qui seront utilisées pour stocker les cartes retournées
let firstCard, secondCard;

// Initialise une variable lockBoard à false qui sera utilisée pour bloquer le tableau pendant le traitement des cartes retournées
let lockBoard = false;

// Initialise une variable score à 0 qui sera utilisée pour suivre le score du joueur
let score = 0;

// Met à jour le texte du score affiché dans l'élément HTML avec la classe "score"
document.querySelector(".score").textContent = score;

// Initialise une variable matchedPairs à 0 qui sera utilisée pour suivre le nombre de paires trouvées
let matchedPairs = 0;

// Utilise l'API Fetch pour récupérer les données du fichier JSON contenant les informations sur les cartes du jeu
fetch("./data/cards.json")

// Transforme la réponse de la requête en un objet JavaScript
  .then((res) => res.json())

// Utilise les données récupérées pour initialiser le tableau cards, mélanger les cartes et générer les éléments HTML pour chaque carte 
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

// Définit la fonction qui mélange les cartes dans le tableau cards 
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// Définit la fonction qui génère les éléments HTML pour chaque carte à partir des données du tableau cards et les affiche dans gridContainer
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

//est appelée lorsque l'utilisateur clique sur une carte. Cette fonction retourne la carte cliquée et vérifie si deux cartes sont retournées pour les comparer
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

// Définit la fonction qui vérifie si les deux cartes retournées sont identiques
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    matchedPairs++;
    if (matchedPairs === cards.length / 2) {
      // Toutes les paires ont été trouvées
      setTimeout(() => {
        document.querySelector(".message").style.display = "block";
      }, 2000);
    }
  } else {
    unflipCards();
  }
}


// Définit la fonction qui désactive les cartes si elles sont identiques
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

// Définit la fonction qui retourne les cartes si elles ne sont pas identiques
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// Définit la fonction qui réinitialise les variables firstCard, secondCard et lockBoard après chaque tour de jeu
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Définit la fonction qui réinitialise le jeu en appelant resetBoard(), en mélangeant les cartes à nouveau, en réinitialisant le score et en régénérant les cartes dans gridContainer
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  
  // Masquer le message de félicitations
  document.querySelector(".message").style.display = "none";
}


function toggleSound() {
      var audio = document.getElementById("myAudio");
      var muteSpeaker = document.querySelector(".mute-speaker");
      if (audio.paused) {
        audio.play();
        muteSpeaker.style.display = "none";
      } else {
        audio.pause();
        muteSpeaker.style.display = "block";
      }
    }