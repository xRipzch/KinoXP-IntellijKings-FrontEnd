class NavBar extends HTMLElement {
    connectedCallback() {
        const link = document.createElement('link'); // creating a link element in the html.
        link.rel = 'stylesheet';                                           //This is used to link css file to html.
        link.href = '../CSS/navbar.css';
        document.head.appendChild(link);
        this.innerHTML =  ` 
            <nav>
                <ul class="left-column">
                    <li><a href="../html/all-movies.html">All movies</a></li>
                    <li><a href="../html/admin.html">Admin</a></li>
                    <li><a href="../html/showings.html">Showings</a></li>
                </ul>
                <ul class="middle-column">
                    <img src="../images/logo.png" alt="Logo">
                    <!--<li><a href="../html/index.html">KinoXP</a></li>-->
                </ul>
                <ul class="right-column">
                    <li><a href="../html/login.html">Login</a></li>
                </ul>
            </nav>
        `; // adding html navbar to custom element.
    }
}

customElements.define('nav-bar', NavBar);
