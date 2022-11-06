# vue-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# Docker things

## Local

### build and tag image

`docker build -f Dockerfile.prod -t cca3:latest .`

### run container

`docker run -it -p 80:80 --rm cca3:latest`

## ECR

### Retrieve an authentication token and authenticate Docker client to the registry.

`aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 024044220872.dkr.ecr.ap-southeast-2.amazonaws.com`

### Build image (from folder where Dockerfile is)

`docker build -t cca3-client .`

### Tag image

`docker tag cca3-client:latest 024044220872.dkr.ecr.ap-southeast-2.amazonaws.com/cca3-client:latest`

### Push to ECR

`docker push 024044220872.dkr.ecr.ap-southeast-2.amazonaws.com/cca3-client:latest`
