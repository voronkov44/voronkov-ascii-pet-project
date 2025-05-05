FROM golang:1.24-alpine

WORKDIR /app

COPY . .

RUN go build -o ascii-pet ./cmd

EXPOSE 8000

CMD ["./ascii-pet"]
