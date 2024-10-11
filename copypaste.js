// Function to generate random seats
function generateRandomSeats() {
    let seats = document.querySelector(".all-seats");
    seats.innerHTML = ""; // Clear existing seats

    for (let i = 0; i < 59; i++) {
        let randint = Math.floor(Math.random() * 2);
        let booked = randint === 1 ? "booked" : "";
        let disabled = booked ? "disabled" : "";

        seats.insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" name="tickets" id="s${i + 2}" ${disabled}/>
            <label for="s${i + 2}" class="seat ${booked}"></label>`
        );
    }

    let tickets = seats.querySelectorAll("input");
    tickets.forEach((ticket) => {
        ticket.addEventListener("change", () => {
            let amount = document.querySelector(".amount").innerHTML;
            let count = document.querySelector(".count").innerHTML;

            amount = Number(amount);
            count = Number(count);

            if (ticket.checked) {
                count += 1;
                amount += 200;
            } else {
                count -= 1;
                amount -= 200;
            }
            document.querySelector(".amount").innerHTML = amount;
            document.querySelector(".count").innerHTML = count;
        });
    });
}

// Initial seat generation
generateRandomSeats();

// Add event listeners to day and time elements to regenerate seats
document.querySelectorAll(".dates-item, .time").forEach((element) => {
    element.addEventListener("click", generateRandomSeats);
});

// Add event listener to the book button
document.querySelector(".book-button").addEventListener("click", () => {
    let selectedSeats = document.querySelectorAll(".all-seats input:checked").length;
    if (selectedSeats > 0) {
        if (confirm("Are you sure you want to book the selected seats?")) {
            alert("Seats booked successfully!");
        }
    } else {
        alert("Please select at least one seat to book.");
    }
});