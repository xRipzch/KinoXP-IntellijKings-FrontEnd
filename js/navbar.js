class NavBar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link'); // creating a link element in the html.
        link.rel = 'stylesheet';                                           //This is used to link css file to html.
        link.href = '../CSS/navbar.css';
        document.head.appendChild(link);
        this.innerHTML =  ` 
            <nav>               
                <ul>
                    <li><a href="../html/index.html">Home</a></li>
                    <li><a href="../html/all-movies.html">All movies</a></li>
                    <li><a href="../html/login.html">Log in</a></li>
                    <li><a href="../html/admin.html">Admin</a></li>
                    <li><a href="../html/movie-details.html">Movie details</a></li>
                    <li><a href="../html/showings.html">Showings</a></li>
                    
                </ul>
            </nav>
        `; // adding html navbar to custom element.
    }
}

customElements.define('nav-bar', NavBar);
