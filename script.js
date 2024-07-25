<!DOCTYPE html>
<html>
<head>
    <title>YouTube Player</title>
</head>
<body>
    <div id="player"></div>
    <button id="prevBtn">Previous</button>
    <button id="nextBtn">Next</button>

    <script>
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

        function getVideoDuration(videoId) {
            return new Promise((resolve, reject) => {
                fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDZEYh45-ytDReALsTFSw7jOMDC5uhyqJw`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.items.length > 0) {
                            const duration = data.items[0].contentDetails.duration;
                            const durationInSeconds = parseISO8601Duration(duration);
                            resolve(durationInSeconds);
                        } else {
                            reject('No data found for video ID: ' + videoId);
                        }
                    })
                    .catch(error => reject('Error fetching video duration: ' + error));
            });
        }

        function parseISO8601Duration(duration) {
            const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
            const hours = (parseInt(match[1]) || 0);
            const minutes = (parseInt(match[2]) || 0);
            const seconds = (parseInt(match[3]) || 0);
            return (hours * 3600) + (minutes * 60) + seconds;
        }

        function loadVideo() {
            if (videoIds.length === 0) {
                console.error('No video IDs available to load.');
                return;
            }
            currentIndex = Math.floor(Math.random() * videoIds.length);
            const videoId = videoIds[currentIndex];

            getVideoDuration(videoId).then(duration => {
                const randomTime = Math.floor(Math.random() * duration);
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
            }).catch(error => console.error(error));
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

        // Load the YouTube IFrame API script
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    </script>
</body>
</html>
