FROM python:bullseye

WORKDIR /code
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY src ./

ENTRYPOINT ["python3", "main.py"]