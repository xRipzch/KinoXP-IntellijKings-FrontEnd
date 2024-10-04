class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <ul>
                    <li><a href="/html/all-movies.html">All movies</a></li>
                    <li><a href="/html/login.html">Log in</a></li>
                    <li><a href="/html/contact.html">Contact</a></li>
                </ul>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);
