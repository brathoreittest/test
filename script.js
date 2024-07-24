let player;
let videoIds = [];
let currentIndex = 0;

function onYouTubeIframeAPIReady() {
    console.log('YouTube IFrame API is ready.');
    fetch('videos.txt')
        .then(response => response.text())
        .then(data => {
            videoIds = data.split('\n').map(id => id.trim()).filter(id => id !== '');
            console.log('Loaded video IDs:', videoIds);
            if (videoIds.length > 0) {
                loadVideo();
            } else {
                console.error('No video IDs found.');
            }
        })
        .catch(error => console.error('Error loading video IDs:', error));
}

function loadVideo() {
    if (videoIds.length === 0) {
        console.error('No video IDs available to load.');
        return;
    }
    const currentIndex = Math.floor(Math.random() * videoIds.length);
    const videoId = videoIds[currentIndex];
    const randomTime = Math.floor(Math.random() * 5400); // Random time between 0 and 9000 seconds
    console.log(`Loading video ID: ${videoId} at random time: ${randomTime} seconds`);
    if (player) {
        player.loadVideoById({ videoId: videoId, startSeconds: randomTime });
    } else {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: { 'start': randomTime },
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    console.log('Player is ready. Starting video.');
    event.target.playVideo();
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (videoIds.length === 0) {
        console.error('No video IDs available for navigation.');
        return;
    }
    currentIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
    console.log('Previous button clicked. Current index:', currentIndex);
    loadVideo();
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (videoIds.length === 0) {
        console.error('No video IDs available for navigation.');
        return;
    }
    currentIndex = (currentIndex + 1) % videoIds.length;
    console.log('Next button clicked. Current index:', currentIndex);
    loadVideo();
});
