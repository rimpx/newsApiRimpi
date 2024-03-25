let domanda = "";

let favourites = localStorage.getItem('favourites');
if (favourites === null) {
    favourites = [];
} else {
    favourites = JSON.parse(favourites);
}

const key = "55a60ebe237c411d9daaabe5dae28280"
const apiUrl = "https://redesigned-engine-px677rgv9v9264xv-3000.app.github.dev/top-headlines";

function search(type = 'customSearch') {
    const lastApiCallKey = `lastApiCall_${type}`;
    const apiDataKey = `apiData_${type}`;
    
    const lastApiCall = localStorage.getItem(lastApiCallKey);
    let lastApiCallDate = null;
    const dataFromLocalStorage = localStorage.getItem(apiDataKey);

    if (lastApiCall !== null) {
        lastApiCallDate = new Date(JSON.parse(lastApiCall));
    }
    const now = new Date();

    if (lastApiCallDate && (now - lastApiCallDate) < 24 * 60 * 60 * 1000 && dataFromLocalStorage) {
        console.log('Data taken from cache');
        displayData(JSON.parse(dataFromLocalStorage), type);
    } else {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                localStorage.setItem(apiDataKey, JSON.stringify(data));
                localStorage.setItem(lastApiCallKey, JSON.stringify(now));
                displayData(data, type);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}



function ricerca() {
    domanda = document.getElementById("testoCercato").value;
    console.log(domanda);
    apiUrl = `https://redesigned-engine-px677rgv9v9264xv-3000.app.github.dev/news-day?query=${encodeURIComponent(domanda)}&language=en`;
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayData(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function italia() {
    console.log("Italia");
    apiUrl = "https://redesigned-engine-px677rgv9v9264xv-3000.app.github.dev/news-day?query=italia&language=it";
    search('italy');
}


function bbc() {
    console.log("BBC News");
    apiUrl = "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=" + key;
    search('bbc');
}

function visualizzareFavorito() {
    console.log(favourites)
    let newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    favourites.forEach(function (article) {
        let newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        let title = document.createElement('h2');
        title.textContent = article.title;

        let description = document.createElement('p');
        description.textContent = article.description;

        let source = document.createElement('p');
        source.textContent = 'Source: ' + article.source.name;

        let publishedAt = document.createElement('p');
        publishedAt.textContent = 'Published At: ' + new Date(article.publishedAt).toLocaleString();

        let content = document.createElement('p');
        content.textContent = article.content;

        if (article.urlToImage && article.urlToImage.trim() !== '') {
            let image = document.createElement('img');
            image.src = article.urlToImage;
            newsItem.appendChild(image); // Aggiungi l'immagine solo se presente
        }

        let url = document.createElement('a');
        url.href = article.url;
        url.textContent = 'Read more';
        url.target = '_blank';

        let buttonRemove = document.createElement('button');
        buttonRemove.textContent = "Rimuovi dai preferiti";
        buttonRemove.onclick = function () {
            console.log("Rimosso dai preferiti");
            favourites = favourites.filter(favourite => favourite.url !== article.url);
            localStorage.setItem('favourites', JSON.stringify(favourites));
            visualizzareFavorito();
        }

        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(publishedAt);
        newsItem.appendChild(source); // Source after description
        newsItem.appendChild(content); // Content at the end
        newsItem.appendChild(url); // URL at the end
        newsItem.appendChild(buttonRemove);

        newsContainer.appendChild(newsItem);
    });

}





function displayData(data) {
    let newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    data.articles.forEach(function (article) {
        let newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        let title = document.createElement('h2');
        title.textContent = article.title;

        let description = document.createElement('p');
        description.textContent = article.description;

        let source = document.createElement('p');
        source.textContent = 'Source: ' + article.source.name;

        let publishedAt = document.createElement('p');
        publishedAt.textContent = 'Published At: ' + new Date(article.publishedAt).toLocaleString();

        let content = document.createElement('p');
        content.textContent = article.content;

        if (article.urlToImage && article.urlToImage.trim() !== '') {
            let image = document.createElement('img');
            image.src = article.urlToImage;
            newsItem.appendChild(image); // Aggiungi l'immagine solo se presente
        }

        let url = document.createElement('a');
        url.href = article.url;
        url.textContent = 'Read more';
        url.target = '_blank';

        const isFavourite = favourites.find(favourite => favourite.url === article.url);

        let buttonFavorite = document.createElement('button');
        buttonFavorite.textContent = isFavourite ? "Già nei preferiti" : "Aggiungi ai preferiti";
        
       
        if (isFavourite) {
            buttonFavorite.disabled = true;
        }

        buttonFavorite.onclick = function () {
            if (!isFavourite) {
                console.log("Aggiunto ai preferiti");
                favourites.push(article);
                localStorage.setItem('favourites', JSON.stringify(favourites));
                this.disabled = true;
                this.textContent = "Preferito"; // Cambia il testo del bottone
            }
        };

        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(publishedAt);
        newsItem.appendChild(source); // Source after description
        newsItem.appendChild(content); // Content at the end
        newsItem.appendChild(url); // URL at the end
        newsItem.appendChild(buttonFavorite);

        newsContainer.appendChild(newsItem);

    });
};


/*
function searchAndUpdate() {
    // Effettua una richiesta al server per verificare se esiste il file JSON
    fetch('/leggi_dati')
        .then(response => {
            if (response.ok) {
                // Il file JSON esiste sul server, leggi i dati
                return response.json();
            } else {
                // Il file JSON non esiste sul server o si è verificato un errore
                throw new Error('Errore durante la lettura dei dati dal server');
            }
        })
        .then(existingData => {
            if (existingData && Object.keys(existingData).length !== 0) {
                // I dati esistenti sono presenti, utilizzali direttamente
                console.log('Dati esistenti:', existingData);
                displayData(existingData); // Funzione per visualizzare i dati (opzionale)
            } else {
                // Nessun dato presente, effettua la richiesta all'API
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(newData => {
                        // Salva i nuovi dati nel file JSON sul server
                        fetch('/salva_dati', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newData)
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to save data on server');
                                }
                                console.log('Dati salvati con successo sul server');
                                displayData(newData); // Funzione per visualizzare i nuovi dati (opzionale)
                            })
                            .catch(error => {
                                console.error('Errore durante il salvataggio dei nuovi dati:', error);
                            });
                    })
                    .catch(error => {
                        console.error('Errore durante la richiesta all\'API:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Errore:', error);
        });
}

function displayData(data) {
    // Funzione per visualizzare i dati nel browser (opzionale)
    console.log(data);
    let newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    data.articles.forEach(function (article) {
        let newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        let title = document.createElement('h2');
        title.textContent = article.title;

        let description = document.createElement('p');
        description.textContent = article.description;

        let source = document.createElement('p');
        source.textContent = 'Source: ' + article.source.name;

        let publishedAt = document.createElement('p');
        publishedAt.textContent = 'Published At: ' + new Date(article.publishedAt).toLocaleString();

        let content = document.createElement('p');
        content.textContent = article.content;

        if (article.urlToImage && article.urlToImage.trim() !== '') {
            let image = document.createElement('img');
            image.src = article.urlToImage;
            newsItem.appendChild(image); // Aggiungi l'immagine solo se presente
        }

        let url = document.createElement('a');
        url.href = article.url;
        url.textContent = 'Read more';
        url.target = '_blank';

        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(publishedAt);
        newsItem.appendChild(source); // Source after description
        newsItem.appendChild(content); // Content at the end
        newsItem.appendChild(url); // URL at the end

        newsContainer.appendChild(newsItem);
    });
}

*/
