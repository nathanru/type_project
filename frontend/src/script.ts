document.getElementById("userForm")?.addEventListener("submit", async (event) => { // Corrected form ID
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
        firstName: formData.get("firstname"),
        lastName: formData.get("lastname"),
        age: Number(formData.get("age"))
    };

    try {
        const response = await fetch("/submit-user-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to submit form.");
        }

        const result = await response.json();
        document.getElementById("message1")!.textContent = result.message;
    } catch (error) {
        console.error(error);
        document.getElementById("message1")!.textContent = "An error occurred.";
    }
});

document.getElementById("cityForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement); // Corrected variable name
    const data = {
        address: formData.get("address"), // Corrected variable name
        city: formData.get("city"), // Corrected variable name
        state: formData.get("state"), // Corrected variable name
        country: formData.get("country") // Corrected variable name
    };

    try {
        const response = await fetch("/submit-address-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // Corrected variable name
        });

        if (!response.ok) {
            throw new Error("Failed to submit form.");
        }

        const result = await response.json();
        document.getElementById("message2")!.textContent = result.message;
    } catch (error) {
        console.error(error);
        document.getElementById("message2")!.textContent = "An error occurred.";
    }
});

