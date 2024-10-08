const inpField = document.getElementById("input-showing-id");
const delButton = document.getElementById("delete-showing");

///////////////////////////////////////////////////////////////////////

async function deleteShowing (showingId) {
    const url = "http://localhost:8080/showing/" + showingId ;
    const confirmDelete = confirm(`Are you sure you want to delete "${showingId}"?`);

    if (confirmDelete) {
        const fetchOptions = {
            method: "DELETE",
        };

        const response = await fetch(url, fetchOptions);

        (response.ok) ? alert('Showing deleted successfully!') : alert('Error, could not delete showing');
    }
}

 delButton.addEventListener('click', function (event) {
     event.preventDefault();
     event.stopPropagation();
     deleteShowing(inpField.value)
 })
