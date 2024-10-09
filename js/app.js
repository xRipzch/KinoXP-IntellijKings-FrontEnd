 console.log("jeg er i formkommune")

document.addEventListener('DOMContentLoaded', createFormEventListener);
const addMovieForm = document.getElementById("add-input-form");

addMovieForm.addEventListener("submit", handleFormSubmit);



async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;  // event er i denne forbindelse "submit"
    const url = form.action;   // action er specificeret i vores html
    console.log(form);
    console.log(url);

    try {
        const formData = new FormData(form);
        console.log(formData)
        const responseData = await postFormDataAsJson(url, formData);
    } catch (error) {
        alert(error.message);
        console.error(error);
    }

}

async function postFormDataAsJson(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData + "plainformdata");
    const objectAsJsonString = JSON.stringify(plainFormData);
    console.log(objectAsJsonString + "objectasjsonstring");

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" ,
        },
        body: objectAsJsonString,
    };
    const response = await fetch(url, fetchOptions);
    if(!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage);
    } else
    {
        console.log(await response.json() + "repsponse.json() ")  // await needed?
    }
}



