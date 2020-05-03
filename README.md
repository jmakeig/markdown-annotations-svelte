# Markdown Annotations

Add text annotations to Markdown documents, similar comments in Google Docs or Microsoft word. The annotations are stored in the Markdown document itself so they travel along with the content through the editing and review cycle. 

## Quick Start

* `npm run build` builds the production version of the browser application
* `npm run start` serves the application at [https://localhost:5000](https://localhost:5000) over HTTP/2 (_See the one-time “Generating HTTPS Certificates” below_)

## Development Set-up

### macOS

#### Requirements

* [Node.js 12+](https://nodejs.org/) to compile the browser application and serve it in development mode
* [mkcert](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/) (_Optional_) to generate HTTPS certificates

#### First Time

##### Generating HTTPS Certificates

It’s likely in production that your application will be served over HTTPS. While standing up an HTTP server on `localhost` is easy for development, browsers behave differently in subtle ways when serving content over HTTPS. Thus it’s important to account for this in development. 

The following uses the open-source [mkcert](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/) utility to create self-signed certificates used to configure an HTTPS for `localhost` along with a trusted certificate authority so your browser doesn’t warn you each time. mkcert just automates the complex process of generating certs. You can use other tools to generate the keys.  _Self-signing and one-off certificate authorities are not suitable for a production application._

* `brew install mkcert` installs [mkcert](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/)
* `mkcert -install` initializes mkcert and adds a trusted certificate authority to the Keychain. 
  _**Caution:** This is a potential security risk._
* `mkcert localhost` creates two `*.pem` files in the current directory that should _not_ be checked into version control. (See `.gitignore`.) These files are referenced in `package.json` to configure the primary web server (defaults to port 5000) and `rollup.config.js` for live reload during development (defaults to port 35729). If you’ve used a different tool to create your keys, you might need to adjust these paths.

#### Ongoing

* `npm run dev` listens for source file changes and hot reloads the application
