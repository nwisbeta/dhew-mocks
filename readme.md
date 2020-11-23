# DHEW Mocks

Mock API implementations for use in the initial development of client applications. 
You can add your own wrap around it to deploy in 

## Usage

To use this package in a node app, you'll need to add a `.npmrc` file with the following

```
@nwisbeta:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=GITHUB_PERSONAL_ACCESS_TOKEN
```

Once that's done, `npm install @nwisbeta/dhew-mocks` should work like a charm ;)

Currently the only mock implementation is for MPI PDQ (Patient Demographics Query)

```javascript
const { mpi } = require('@nwisbeta/dhew-mocks');

const soapRequest = "<...>" 
// This should be a real SOAP request as per the specification 
// (see https://github.com/nwisbeta/api-catalogue/blob/master/catalogue/mpi/pdq/spec/service.wsdl)

const soapResonse = mpi.pdq.InvokePatientDemographicsQuery(soapMessage);
```
