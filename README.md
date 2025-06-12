## Project setup

## Create .env file with these variables
```bash
API_PORT=3000
FRONT_PORT=3001
TYPEORM_HOST=postgres
TYPEORM_PORT=5432
TYPEORM_USERNAME=genesis
TYPEORM_PASSWORD=genesis
TYPEORM_DATABASE=genesis
TYPEORM_SYNCHRONIZE=true
JWT_ACCESS_SECRET=skhgflhzlkkjbkjxvbdfkjbxj
JWT_REFRESH_SECRET=refreshlskhclkdhslhcl
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=28d
```

## Compile and run the project

```bash
$ docker compose up --build
```

and go to http://localhost:3001/
