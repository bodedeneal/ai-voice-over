document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const generateBtn = document.getElementById('generate-btn');
    const downloadLink = document.getElementById('download-link');

    // Replace this with your actual API key and endpoint
    const API_ENDPOINT = "https://api.example.com/tts";
    const API_KEY = "YOUR_API_KEY";

    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (text === '') {
            alert('Please enter some text to generate.');
            return;
        }

        // Disable button and show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        downloadLink.style.display = 'none';

        try {
            // Make a request to the external TTS API
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    text: text,
                    voice: 'deep_male' // A conceptual voice ID
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            // Get the audio data as a blob
            const audioBlob = await response.blob();
            
            // Create a download link for the audio file
            const audioUrl = URL.createObjectURL(audioBlob);
            downloadLink.href = audioUrl;
            downloadLink.download = 'voiceover.mp3';
            downloadLink.style.display = 'block';

        } catch (error) {
            console.error('Error generating audio:', error);
            alert('Failed to generate audio. Please try again.');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate';
        }
    });
});


