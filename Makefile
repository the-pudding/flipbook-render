download:
	aws s3 cp s3://pudding.cool/projects/flipbook-data/drawings ./output/drawings --recursive

human:
	aws s3 cp s3://pudding.cool/projects/flipbook-data/human ./output/human --recursive

films:
	# rm output/films/*.mp4
	@for i in {1..27}; do \
		echo "Processing folder $$i..."; \
		cd output/png/$$i; \
		ffmpeg -framerate 12 -i %05d.png -c:v libx264 -r 30 -pix_fmt yuv420p ../../films/$$i.mp4; \
		cd ../../..; \
	done
	@echo "Processing complete."

films-human:
	cd output/png-human-film/$$i; \
		ffmpeg -framerate 8 -i %05d.png -c:v libx264 -r 30 -pix_fmt yuv420p ../human.mp4; \
		cd ../../..; \
	@echo "Processing complete."

join-1:
	ffmpeg -i output/films/1.mp4 -i output/films/7.mp4 -i output/films/13.mp4 -i output/films/19.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-1.mp4

join-2:
	ffmpeg -i output/films/2.mp4 -i output/films/8.mp4 -i output/films/14.mp4 -i output/films/20.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-2.mp4

join-3:
	ffmpeg -i output/films/3.mp4 -i output/films/9.mp4 -i output/films/15.mp4 -i output/films/21.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-3.mp4

join-4:
	ffmpeg -i output/films/4.mp4 -i output/films/10.mp4 -i output/films/16.mp4 -i output/films/22.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-4.mp4

join-5:
	ffmpeg -i output/films/5.mp4 -i output/films/11.mp4 -i output/films/17.mp4 -i output/films/23.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-5.mp4

join-6:
	ffmpeg -i output/films/6.mp4 -i output/films/12.mp4 -i output/films/18.mp4 -i output/films/24.mp4 -filter_complex \
	"[0:v][1:v][2:v][3:v]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[v]" -map "[v]" \
	-s 2160x2160 output/films/join-6.mp4

join: join-1 join-2 join-3 join-4 join-5 join-6

