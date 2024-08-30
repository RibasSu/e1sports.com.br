function showAlert(message, type = 'error') {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = `alert ${type} show`;
    alertDiv.innerHTML = `${message} <span class="closebtn">&times;</span>`;

    // Hide alert after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 5000);

    // Close button functionality
    alertDiv.querySelector('.closebtn').onclick = () => {
        alertDiv.classList.remove('show');
    };
}

document.getElementById('scanForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = document.getElementById('target').value;
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Clear previous results
    resultsDiv.innerHTML = '';
    loadingDiv.style.display = 'block';
    document.getElementById('alert').classList.remove('show'); // Hide alert

    try {
        const response = await fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showAlert(errorData.error || 'An error occurred', 'error');
            return;
        }

        const data = await response.json();
        resultsDiv.innerHTML = `<h2>Results for ${data.target}</h2>`;

        data.results.filter(result => result.status === 'open').forEach(result => {
            resultsDiv.innerHTML += `
            <div class="result open">
            Port ${result.port} (${result.service})
            </div>
            `;
        });

        resultsDiv.innerHTML += `<p>${data.message}</p>`;
    } catch (error) {
        console.error('Error:', error);
        showAlert(`Error: ${error.message}`, 'error');
    } finally {
        loadingDiv.style.display = 'none';
    }
});