document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const speakBtn = document.getElementById('speak-btn');
    const stopBtn = document.getElementById('stop-btn');
    const synth = window.speechSynthesis;

    let voices = [];

    function populateVoiceList() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = ''; // Clear previous options

        let deepMaleVoiceIndex = -1;
        const preferredVoiceName = 'Google UK English Male'; // A common deep male voice
        
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            voiceSelect.appendChild(option);

            // Check if this is the voice we want to select
            if (voice.name === preferredVoiceName) {
                deepMaleVoiceIndex = index;
            }
        });

        // Set the default voice to a deep male voice if found
        if (deepMaleVoiceIndex !== -1) {
            voiceSelect.selectedIndex = deepMaleVoiceIndex;
        }
    }

    // Populate voices on page load and when they change
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }

    speakBtn.addEventListener('click', () => {
        if (textInput.value.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(textInput.value);
            const selectedVoiceName = voiceSelect.value;
            const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
                
                // Adjust pitch and rate for a deeper, slower tone
                utterance.pitch = 0.8; // Lower pitch
                utterance.rate = 0.9; // Slower rate
                
                synth.speak(utterance);
            } else {
                alert('Selected voice not found.');
            }
        } else {
            alert('Please enter some text to speak.');
        }
    });

    stopBtn.addEventListener('click', () => {
        synth.cancel();
    });
});

