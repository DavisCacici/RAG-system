from markitdown import MarkItDown
import os

md = MarkItDown(enable_plugins=False) # Set to True to enable plugins
# result = md.convert("../data/Nisi_Doc_Soluzioni_MES.v1.1.pdf")
directory = "../data"
dir_dest = "../data_md"
files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

for file in files:
    file_path = os.path.join(directory, file)
    result = md.convert(file_path)
    print(f"=== {file} ===")
    output_file = os.path.join(dir_dest, f"{os.path.splitext(file)[0]}.md")
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(result.text_content)