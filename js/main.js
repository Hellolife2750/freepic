var cards;
var cardsContainer = document.getElementById("principal");

const drawsJsonPath = 'res/data/draws.json'

/*récupère le informations sur les draws contenus dans le fichier json*/
fetch(drawsJsonPath)
    .then(response => response.json())
    .then(data => {
        cards = data.draws;
        let lastCard;

        cards.forEach(card => {
            cardsContainer.insertAdjacentHTML('beforeend', generateCardCode(card));
            //lastCard = container.lastElementChild;

            //cardsElements.push(lastCard);
            /*lastCard.addEventListener('click', function (event) {
                console.log(event.target)
            });*/

        });
    })
    .catch(error => console.error("MyError : Unable to load draws' card content :", error));

//Génère le code pour la carte passée en paramètre
function generateCardCode(card) {
    let cardCode = `
    <div class="card" onclick="handleClick(this)">
        <img alt="${card.title}" src="${card.link}">
    </div>
    `
    return cardCode;
};

const drawsPopup = document.getElementById("draws-popup");
const popupCard = document.getElementById('popup-card');

var projectsPopupOpened = false;
var currentProjectIndex;

function handleClick(cardClicked) {
    currentProjectIndex = getIndexOfTitleId(cardClicked.querySelector("img").getAttribute("alt"));
    loadPopupContent();
    openCardPopup();
}

const pupPreview = popupCard.querySelector(".preview");
const pupTitle = popupCard.querySelector(".title");
const dlSvgLink = document.getElementById("dl-svg-link");

function loadPopupContent() {
    const currentProject = cards[currentProjectIndex];

    pupTitle.textContent = currentProject.title;
    pupPreview.src = currentProject.link;
    dlSvgLink.href = currentProject.link
}

function getIndexOfTitleId(altContent) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].title == altContent) {
            return i;
        }
    }
    return -1;
}

document.addEventListener('mouseup', function (event) {
    if (projectsPopupOpened && !popupCard.contains(event.target)) {
        closeCardPopup();
    }
});

function openCardPopup() {
    projectsPopupOpened = true;
    drawsPopup.style.display = "flex";
}

function closeCardPopup() {
    projectsPopupOpened = false;
    drawsPopup.style.display = "none";
}

//boutons permettant de dl
const dlSvgBtn = document.getElementById("dl-svg-btn");
const dlPngBtn = document.getElementById("dl-png-btn");

const canvas = document.getElementById("canvas");
const dlContestImg = document.getElementById("dl-contest-img");

const wdResolutionInput = document.getElementById("wd-resolution-input");
const hgResolutionInput = document.getElementById("hg-resolution-input");

function downloadToPNG() {
    dlContestImg.src = cards[currentProjectIndex].link;
    dlContestImg.width = wdResolutionInput.value;
    dlContestImg.height = hgResolutionInput.value;

    canvas.width = dlContestImg.width;
    canvas.height = dlContestImg.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(dlContestImg, 0, 0);

    canvas.toBlob(function (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "draw.png";

        link.click();
        // Libérer la ressource URL
        URL.revokeObjectURL(link.href);
    }, "draw/png");
}

dlPngBtn.addEventListener('click', () => {
    /*var canvas = document.createElement("canvas");
    canvg(canvas, pupPreview.outerHTML);

    html2canvas(canvas).then(function (canvas) {
        // Créer un lien de téléchargement
        var link = document.createElement("a");
        link.download = "image.png"; // Nom du fichier téléchargé
        link.href = canvas.toDataURL("image/png");

        // Ajouter le lien au document et cliquer dessus pour déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });*/
});

//envoie un message sur un serv discord

const sendSuggestionBtn = document.getElementById('send-suggestion-btn');
const suggestionInput = document.getElementById('suggestion-input');

sendSuggestionBtn.addEventListener('click', () => {
    if (suggestionInput.value != "") {
        sendMessage(suggestionInput.value);
        suggestionInput.value = "";
    }
});

async function sendMessage(message) {

    var request = new XMLHttpRequest();
    const discordResponse = await fetch("https://discord.com/api/webhooks/1141791205756248095/6RD-IJZT8wWI88QIwspIEtqRQFSW8jcPFMQF0uOHoe3kpus-_6Nyz7J5Mw9teXIykT17");
    request.open("POST", "https://discord.com/api/webhooks/1141791205756248095/6RD-IJZT8wWI88QIwspIEtqRQFSW8jcPFMQF0uOHoe3kpus-_6Nyz7J5Mw9teXIykT17", true);
    request.setRequestHeader('Content-type', 'application/json');

    var params = {
        username: "FreepicClient",
        content: "" + message
    };

    request.send(JSON.stringify(params));
}
