def readDataFile(name: str):
    with open(f"src/test/data/{name}", mode="rt",encoding="utf-8") as file:
        contents = file.readlines()
    return "".join(contents)
