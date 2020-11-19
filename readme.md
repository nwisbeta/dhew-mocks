#Overview

The purpose of this repository is to bundle the logic for various mocks used by the DHEW team. Currently the only mock implementation in this repo is MPI - Patient Demographics Query (PDQ)

## Usage

To use the package you need to add the github npm registry to your project as an npm source. In the same folder as your package.json, create a file called `.npmrc` and add the following

`@nwisbeta:registry=https://npm.pkg.github.com/` 

>NOTE: Make sure there are no empty spaces.

Depending on where you are building you app from you might need to supply an access key. If this is the case you have to add the below on a new line.

`//npm.pkg.github.com/:_authToken=YOUR_ACCESS_TOKEN`

You can then update your package.json file manually or try running 

`npm install @nwisbeta/dhew-mocks`