# ManagAI (Go monolit, Hello)

## Lokál
```bash
go run ./cmd/server
```

## Docker
```bash
docker build -t managai:dev .
docker run -p 8080:8080 -e CRON_SECRET=dev -e MANAGAI_ORG_ID=demo managai:dev
```
