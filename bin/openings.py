import pandas as pd

chars = ['a', 'b', 'c', 'd', 'e']
frames = []
for char in  chars:
    frame = pd.read_csv(f'https://raw.githubusercontent.com/niklasf/chess-openings/master/dist/{char}.tsv', sep='\t')
    frames.append(frame)
all_frames = pd.concat(frames)

print(all_frames)