# backend-starter
Starter project for all of the backends.


## JWT key generating

```console
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
$ openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

Can be saved to the folder `keys` for better handling.
