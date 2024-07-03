# NH CHAT


## Run as Development

```shell
yarn install
yarn dev
```


## Run use docker

make sure install docker and docker-compose first.


Build the image
```shell
docker-compose build
```

Run the container
```shell
docker-compose up
```

Run the container in background
```shell
docker-compose up -d
```

APP URL: will be: http://YOUR-IP and run use nginx on port 80



## Config cors in backend 

check in backend serverless.yml 

and add domains to allow cors

```yaml

  httpApi:
    cors:
      allowedOrigins:
        - http://localhost:3000
        - http://localhost
      allowedHeaders:
        - Content-Type
        - Authorization
```

