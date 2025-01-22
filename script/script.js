// A: Array, um die Pokémon-Daten zu speichern, die von der API geladen werden.
let allPokemon = [];

// B: Die fetchDataJson-Funktion lädt Pokémon-Daten von der API und speichert sie in allPokemon.
async function fetchDataJson() {
   // A: Ladebalken anzeigen
   let loadingContainer = document.getElementById("loading-container");
   let loadingBar = document.getElementById("loading-bar");
   
   // Ladebalken sichtbar machen
   loadingContainer.style.display = "block";

   // Ladebalken für 3 Sekunden animieren
   setTimeout(() => {
       loadingContainer.style.display = "none";  // Ladebalken nach 3 Sekunden ausblenden
   }, 3000); // 3 Sekunden

    const typeIcons = {
        fire: '🔥',
        water: '💧',
        grass: '🌿',
        rock: '🪨',
        electric: '⚡',
        poison: '💀',
        flying: '🪽',
        bug: '🐞',
        normal: '😊'
    };
   

    // C: API-Abfrage, um eine Liste von 12 Pokémon zu erhalten.
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=18&offset=0");
    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Pokémon-Daten');
    }
    
    
    // D: Umwandeln der Antwort in ein JSON-Objekt, das weiterverarbeitet werden kann.
    let responseToJson = await response.json();
  
    // E: HTML-Element mit der ID 'content' wird geleert, um Platz für neue Pokémon-Daten zu schaffen.
    let content = document.getElementById("content");
    content.innerHTML = "";

    // F: Schleife, die über alle Pokémon-Ergebnisse iteriert und die Details jedes Pokémon abruft.
    for (let i = 0; i < responseToJson.results.length; i++) {
        let responseData = await fetch(responseToJson.results[i].url);
        let responseDataJson = await responseData.json();
        let sprite = responseDataJson.sprites.front_default;
        let pokeElement = responseDataJson.types.map((type) => type.type.name);
        
        // G: Erstellen einer Textdarstellung für die Pokémon-Typen mit Icons.
        let typesWithIcons = pokeElement.map(
            (type) => `${type.charAt(0).toUpperCase() + type.slice(1)} ${typeIcons[type] || '❓'}`
        ).join(', ');

        // H: Speichern jedes Pokémon im allPokemon Array für späteres Filtern.
        allPokemon.push({
            name: responseToJson.results[i].name,
            sprite: sprite,
            types: pokeElement, // Speichern der Typen als Array für das Filtern
            typesWithIcons: typesWithIcons,
            stats: responseDataJson.stats
        });

        // I: Dynamisch generierter HTML-Inhalt für jedes Pokémon, einschließlich Vorder- und Rückseite der Karte.
        content.innerHTML += `
        <div class="cardContainer" onclick="flipCard(this)">
            <div class="cards">
                <div class="front">
                    <div class="nameBox">${responseToJson.results[i].name.charAt(0).toUpperCase() + responseToJson.results[i].name.slice(1)}</div>
                    <img class="pokemonImages" src="${sprite}">
                    <div>${typesWithIcons}</div>
                </div>
                <div class="back">
                    <h3>Statistiken</h3>
                    <p>HP: ${responseDataJson.stats[0].base_stat}</p>
                    <p>Angriff: ${responseDataJson.stats[1].base_stat}</p>
                    <p>Verteidigung: ${responseDataJson.stats[2].base_stat}</p>
                    <p>Spezial-Angriff: ${responseDataJson.stats[3].base_stat}</p>
                    <p>Spezial-Verteidigung: ${responseDataJson.stats[4].base_stat}</p>
                    <p>Geschwindigkeit: ${responseDataJson.stats[5].base_stat}</p>
                </div>
            </div>
        </div>`;
    }
    
}


// J: Neue Funktion zum Filtern der Pokémon nach Typen (Elementen)
function filterPokemon() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    let content = document.getElementById("content");
    content.innerHTML = ""; // K: Inhalt leeren, um die gefilterten Ergebnisse anzuzeigen

   

    // L: Durchlaufen des allPokemon Arrays mit einer for-Schleife, um nach Typen zu filtern.
    for (let i = 0; i < allPokemon.length; i++) {
        // M: Überprüfen, ob das Pokémon den eingegebenen Typen enthält
        if (allPokemon[i].types.includes(searchInput)) {
            foundPokemon = true;
            content.innerHTML += `
            <div class="cardContainer" onclick="flipCard(this)">
                <div class="cards">
                    <div class="front">
                        <div class="nameBox">${allPokemon[i].name.charAt(0).toUpperCase() + allPokemon[i].name.slice(1)}</div>
                        <img class="pokemonImages" src="${allPokemon[i].sprite}">
                        <div>${allPokemon[i].typesWithIcons}</div>
                    </div>
                    <div class="back">
                        <h3>Statistiken</h3>
                        <p>HP: ${allPokemon[i].stats[0].base_stat}</p>
                        <p>Angriff: ${allPokemon[i].stats[1].base_stat}</p>
                        <p>Verteidigung: ${allPokemon[i].stats[2].base_stat}</p>
                        <p>Spezial-Angriff: ${allPokemon[i].stats[3].base_stat}</p>
                        <p>Spezial-Verteidigung: ${allPokemon[i].stats[4].base_stat}</p>
                        <p>Geschwindigkeit: ${allPokemon[i].stats[5].base_stat}</p>
                    </div>
                </div>
            </div>`;
        }
    }

    // N: Wenn kein Pokémon gefunden wurde, wird eine Nachricht angezeigt.
    if (!foundPokemon) {
        content.innerHTML = "<p>No Pokémon found with that type.</p>";
    }
    
}

// O: Funktion zum Anzeigen von detaillierten Pokémon-Informationen in einem Popup.
function showDetails(pokemonData) {
    const popup = document.getElementById("pokemon-details-popup");
    const nameElement = document.getElementById("popup-pokemon-name");
    const imageElement = document.getElementById("popup-pokemon-image");
    const statsElement = document.getElementById("popup-pokemon-stats");

    nameElement.textContent = pokemonData.name;
    imageElement.src = pokemonData.sprite;
    statsElement.innerHTML = `
        <p>HP: ${pokemonData.hp}</p>
        <p>Angriff: ${pokemonData.attack}</p>
        <p>Verteidigung: ${pokemonData.defense}</p>
        <p>Spezial-Angriff: ${pokemonData.specialAttack}</p>
        <p>Spezial-Verteidigung: ${pokemonData.specialDefense}</p>
        <p>Geschwindigkeit: ${pokemonData.speed}</p>
    `;

    // P: Das Popup wird sichtbar gemacht.
    popup.style.display = "flex";
}

// Q: Funktion zum Schließen des Popups.
function closePopup() {
    document.getElementById("pokemon-details-popup").style.display = "none";
}

// R: Funktion, die eine Karte umdreht, wenn sie angeklickt wird.
function flipCard(cardElement) {
    cardElement.classList.toggle('flipped');
}



// A: Initialisiert das Array allPokemon, das alle geladenen Pokémon speichert.

// B: Die Funktion fetchDataJson lädt Pokémon-Daten von der API und speichert diese im allPokemon-Array.

// C: Die API wird aufgerufen, um 12 Pokémon-Daten zu erhalten.

// D: Die API-Antwort wird in ein JSON-Format umgewandelt.

// E: Der vorhandene HTML-Inhalt wird gelöscht, bevor neue Daten hinzugefügt werden.

// F: Eine Schleife durchläuft alle Pokémon und holt die Details ab.

// G: Erstellt eine Textdarstellung für die Typen des Pokémon mit Icons.

// H: Speichert die geladenen Pokémon in allPokemon für das spätere Filtern.

// I: Fügt die Pokémon als HTML-Elemente in den Inhalt ein.

// J: Funktion zum Filtern der Pokémon basierend auf ihrem Typ (Element).

// K: Leert den Inhalt, bevor die gefilterten Ergebnisse angezeigt werden.

// L: Durchläuft das allPokemon-Array, um nach passenden Typen zu suchen.

// M: Überprüft, ob das Pokémon den gesuchten Typ (Element) enthält.

// N: Zeigt eine Nachricht an, falls kein Pokémon mit dem gesuchten Typ gefunden wurde.

// O: Zeigt detaillierte Informationen zu einem Pokémon in einem Popup an.

// P: Macht das Popup sichtbar.

// Q: Schließt das Popup, wenn der Benutzer auf "Schließen" klickt.

// R: Dreht die Karte um, wenn sie angeklickt wird.