* `npm run start` serves the application at [https://localhost:5000](https://localhost:5000) over HTTP/2 using the above HTTPS configuration

## Development Set-up

### First Time

#### macOS

* `brew install mkcert` installs [mkcert](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/)
* `mkcert -install` initializes mkcert and adds a trusted certificate authority to the Keychain. _**Caution:** This is a potential security risk._
* `mkcert localhost` creates two `*.pem` files in the current directory that should _not_ be checked into version control. (See `.gitignore`.)

### Each Session

* `npm run dev` listens for source file changes and hot reloads the application
