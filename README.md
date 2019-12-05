# backend-starter

Starter project for all of the backends.

## Getting started

First install the packages.

```console
$ yarn install
```

Then rename the `example.env` file to `.env`

Then run the development server. (Make sure you (generated the JWT keys)[JWT key generating])

```console
$ yarn dev
```

> If you want to run a local instance of mongoDB you can run this command
>
> ```console
> $ yarn mongo
> ```

## Testing

```console
$ yarn test
```

## Build

First build the project for running the server in production

```console
$ yarn build
```

## JWT key generating

Your keys can be saved anywhere but I always create the folder `keys` and put them there. Here is an example.

```console
$ mkdir keys
$ cd keys
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwt.private.key
$ openssl rsa -in jwt.private.key -pubout -outform PEM -out jwt.public.key
```
