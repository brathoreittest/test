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
    const videoId = videoIds[currentIndex];
    console.log(`Loading video ID: ${videoId}`);
    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady(event) {
    console.log('Player is ready.');
    const duration = player.getDuration();
    if (duration > 0) {
        const randomTime = Math.floor(Math.random() * duration);
        console.log(`Starting video at random time: ${randomTime} seconds`);
        event.target.seekTo(randomTime);
        event.target.playVideo();
    } else {
        console.log('Duration not available yet, waiting...');
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const duration = player.getDuration();
        if (duration > 0) {
            const randomTime = Math.floor(Math.random() * duration);
            console.log(`Starting video at random time: ${randomTime} seconds`);
            player.seekTo(randomTime);
            player.playVideo();
        }
    }
}

function onPlayerError(event) {
    console.error('Error occurred. Skipping to next video.');
    handlePlayerError(event.data);
}

function handlePlayerError(errorCode) {
    switch (errorCode) {
        case 2:
            console.error('Invalid video ID.');
            break;
        case 5:
            console.error('HTML5 player error.');
            break;
        case 100:
            console.error('Video not found or removed.');
            break;
        case 101:
        case 150:
            console.error('Embedding disabled or age-restricted video.');
            break;
        default:
            console.error('Unknown error.');
            break;
    }
    loadNextVideo();
}

function loadNextVideo() {
    if (videoIds.length === 0) {
        console.error('No video IDs available for navigation.');
        return;
    }
    currentIndex = (currentIndex + 1) % videoIds.length;
    loadVideo();
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
