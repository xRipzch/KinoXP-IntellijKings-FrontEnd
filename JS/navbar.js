class NavBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <ul>
                    <li><a href="/movies.html">All movies</a></li>
                    <li><a href="/log-in.html">Log in</a></li>
                    <li><a href="/contact.html">Contact</a></li>
                </ul>
            </nav>
        `;
    }
}

customElements.define('nav-bar', NavBar);
