import '../App.css'

const VideoBackground = () => (
	<div className="video-background">
		<video autoPlay muted loop id="bg-video">
			<source
				src={`${process.env.PUBLIC_URL}/clock.mp4`}
				type="video/mp4"
			/>
			Your browser does not support the video tag.
		</video>
	</div>
);

export default VideoBackground;