document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the login form
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const holderAddress = document.getElementById('holder-address').value;

        // Handle login logic here
        if (holderAddress) {
            document.getElementById('share-section').classList.remove('hidden');
            document.getElementById('message').innerText = "Login successful!";
        } else {
            document.getElementById('message').innerText = "Please enter a valid address.";
        }
    });

    // Add event listener to store share button
    document.getElementById('store-share').addEventListener('click', async () => {
        const holderAddress = document.getElementById('holder-address').value; // Get holder address
        const shareData = document.getElementById('encrypted-share').value;

        try {
            const response = await fetch('http://localhost:3000/api/share/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ holderAddress, shareData }), // Send both holder address and share data
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('message').innerText = data.message; // Show success message
            } else {
                const errorData = await response.json();
                document.getElementById('message').innerText = errorData.message; // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Error storing share.';
        }
    });

    // Add event listener to recover share button
    document.getElementById('recover-share').addEventListener('click', async () => {
        const holderAddress = document.getElementById('holder-address').value; // Use the same holder address from login

        try {
            const response = await fetch('http://localhost:3000/api/share/recover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ holderAddress }), // Send the holder address for recovery
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('message').innerHTML = `
                    <strong>${data.message}</strong><br>
                    <strong>Recovered Share Data:</strong><br>
                    Holder Address: ${data.data.holderAddress}<br>
                    Share Data: ${data.data.shareData}
                `;
            } else {
                const errorData = await response.json();
                document.getElementById('message').innerText = errorData.message; // Show error message
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Error recovering share.';
        }
    });
});
