document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const recordBtn = document.getElementById('record-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');
    const statusText = document.getElementById('status');
    const synth = window.speechSynthesis;

    let voices = [];
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;

    // Set up voice options
    function populateVoiceList() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        const preferredVoiceName = 'Google UK English Male';
        
        let deepMaleVoiceFound = false;
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            if (voice.name === preferredVoiceName) {
                option.selected = true;
                deepMaleVoiceFound = true;
            }
            voiceSelect.appendChild(option);
        });
        
        // If the preferred voice wasn't found, use a default
        if (!deepMaleVoiceFound && voices.length > 0) {
            voiceSelect.selectedIndex = 0;
        }
    }

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }

    // Function to speak and record the text
    function speakAndRecord() {
        const text = textInput.value.trim();
        if (text === '') {
            alert('Please enter some text to speak.');
            return;
        }

        // Check for Web Speech API and MediaRecorder support
        if (!synth || !navigator.mediaDevices || !MediaRecorder) {
            alert("Your browser does not support the necessary APIs for this function.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                isRecording = true;
                recordBtn.disabled = true;
                stopBtn.disabled = false;
                downloadBtn.disabled = true;
                statusText.textContent = 'Recording started...';

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    downloadBtn.href = audioUrl;
                    downloadBtn.download = 'voiceover.wav';
                    downloadBtn.disabled = false;
                    statusText.textContent = 'Recording complete. Click "Download" to save the file.';
                    
                    stream.getTracks().forEach(track => track.stop()); // Stop mic access
                    isRecording = false;
                    recordBtn.disabled = false;
                    stopBtn.disabled = true;
                };

                // Start recording
                mediaRecorder.start();

                // Start speaking after a small delay to ensure recording is active
                setTimeout(() => {
                    const utterance = new SpeechSynthesisUtterance(text);
                    const selectedVoiceName = voiceSelect.value;
                    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
                    
                    if (selectedVoice) {
                        utterance.voice = selectedVoice;
                        utterance.pitch = 0.8;
                        utterance.rate = 0.9;
                    }
                    
                    utterance.onend = () => {
                        if (isRecording) {
                            mediaRecorder.stop();
                        }
                    };

                    synth.speak(utterance);
                }, 500); // Small delay
            })
            .catch(err => {
                console.error('Recording error:', err);
                alert('Could not start recording. Please check your microphone permissions.');
            });
    }

    // Event listeners
    recordBtn.addEventListener('click', speakAndRecord);

    stopBtn.addEventListener('click', () => {
        if (isRecording) {
            synth.cancel();
            mediaRecorder.stop();
        }
    });

    // Handle button state on ongoing speech
    synth.onstart = () => {
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    };
    synth.onend = () => {
        if (!isRecording) {
            recordBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };
});
