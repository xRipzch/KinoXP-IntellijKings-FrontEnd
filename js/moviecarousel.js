document.addEventListener('DOMContentLoaded', () => {
    fetchCardData().then(r => console.log('Card data fetched!'));
});

async function fetchCardData() {
    try {
        const response = await fetch('http://localhost:8080/movies');
        const movies = await response.json();

        movies.forEach(movie => {
            createCard(movie.imageUrl, movie.title, movie.releaseDate, movie.id);
        });
    } catch (error) {
        console.error('Error fetching card data:', error);
    }
}
function createCard(imageUrl, title, releaseDate, movieId) {
    const cardContainer = document.createElement('article');
    cardContainer.classList.add('card');

    cardContainer.innerHTML = `
        <img
            class="card__background"
            src="${imageUrl}"
            alt="Card background"
            width="1920"
            height="2193"
        />
        <div class="card__content | flow">
            <div class="card__content--container | flow">
                <h2 class="card__title">${title}</h2>
                <p class="card__description">Release Date: ${releaseDate}</p>
            </div>
            <a href="../html/movie-details.html?id=${movieId}" class="card__button">Read more</a>
        </div>
    `;

    document.querySelector('.card-container').appendChild(cardContainer);
}
