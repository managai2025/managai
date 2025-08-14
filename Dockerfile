FROM golang:1.22-alpine AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /server ./cmd/server

FROM gcr.io/distroless/base-debian12
COPY --from=build /server /server
ENV PORT=8080
EXPOSE 8080
CMD ["/server"]
