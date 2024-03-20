download:
	aws s3 cp s3://pudding.cool/projects/flipbook-data/drawings ./output/drawings --recursive

human:
	aws s3 cp s3://pudding.cool/projects/flipbook-data/human ./output/human --recursive

films:
	@find . -type f -name '*.mp4' -exec rm {} +
	@for i in {1..6}; do \
		echo "Processing folder $$i..."; \
		cd output/png/$$i; \
		ffmpeg -framerate 12 -i %05d.png -c:v libx264 -r 30 -pix_fmt yuv420p ../../animation-$$i.mp4; \
		cd ../../..; \
	done
	@echo "Processing complete."


