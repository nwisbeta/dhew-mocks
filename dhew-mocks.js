const xpath = require("xpath");
const xmlParser = require("xmldom").DOMParser;

const fillErrorTemplate = function(code, message){
  return `<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><soap:Fault><faultcode>${code}</faultcode><faultstring>${message}</faultstring><detail/></soap:Fault></soap:Body></soap:Envelope>`
}
const fillResponseTemplate = function (date, qpdSegment , results) {
  return `<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'><soap:Body><InvokePatientDemographicsQueryResponse xmlns='http://apps.wales.nhs.uk/mpi/'><RSP_K21 xmlns='urn:hl7-org:v2xml'><MSH><MSH.1>|</MSH.1><MSH.2>^~\\&amp;</MSH.2><MSH.3><HD.1>100</HD.1></MSH.3><MSH.4><HD.1>100</HD.1></MSH.4><MSH.5><HD.1>218</HD.1></MSH.5><MSH.6><HD.1>218</HD.1></MSH.6><MSH.7><TS.1>${date}</TS.1></MSH.7><MSH.9><MSG.1>RSP</MSG.1><MSG.2>K22</MSG.2><MSG.3>RSP_K22</MSG.3></MSH.9><MSH.10>41</MSH.10><MSH.11><PT.1>P</PT.1></MSH.11><MSH.12><VID.1>2.5</VID.1></MSH.12><MSH.17>GBR</MSH.17><MSH.19><CE.1>EN</CE.1></MSH.19></MSH><MSA><MSA.1>AA</MSA.1><MSA.2>9783</MSA.2></MSA><QAK><QAK.1>PatientQuery</QAK.1><QAK.2>OK</QAK.2></QAK>${qpdSegment}${results}</RSP_K21></InvokePatientDemographicsQueryResponse></soap:Body></soap:Envelope>`
}

const results = "<RSP_K21.QUERY_RESPONSE><PID><PID.1>001</PID.1><PID.3><CX.1>28905311</CX.1><CX.4><HD.1>100</HD.1></CX.4><CX.5>PE</CX.5></PID.3><PID.3><CX.1>E123679</CX.1><CX.4><HD.1>129</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>H8565187</CX.1><CX.4><HD.1>149</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>206385</CX.1><CX.4><HD.1>154</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>0000677299</CX.1><CX.4><HD.1>237</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>5555599226</CX.1><CX.4><HD.1>NHS</HD.1></CX.4><CX.5>NH</CX.5></PID.3><PID.5><XPN.1><FN.1>Holmes</FN.1></XPN.1><XPN.2>Sherlock</XPN.2><XPN.5>Mr</XPN.5><XPN.7>U</XPN.7></PID.5><PID.7><TS.1>19381108000000</TS.1></PID.7><PID.8>M</PID.8><PID.9><XPN.7>A</XPN.7></PID.9><PID.11><XAD.1><SAD.1>21 Cowbridge Road East</SAD.1></XAD.1><XAD.2>Riverside</XAD.2><XAD.3>Cardiff</XAD.3><XAD.4>South Glamorgan</XAD.4><XAD.5>CF11 9AD</XAD.5><XAD.7>H</XAD.7></PID.11><PID.13><XTN.1>07000 111111</XTN.1><XTN.2>PRN</XTN.2><XTN.4>sherlock.holmes@example.com</XTN.4></PID.13><PID.13><XTN.2>PRS</XTN.2></PID.13><PID.14><XTN.2>WPN</XTN.2></PID.14><PID.22><CE.1>A</CE.1></PID.22></PID><PD1><PD1.3><XON.3>W31111</XON.3></PD1.3><PD1.4><XCN.1>G3353251</XCN.1></PD1.4></PD1></RSP_K21.QUERY_RESPONSE>";
const noResults = "<RSP_K21.QUERY_RESPONSE/>";


function toHl7DateFormat(ts) {
  var date = new Date(ts);

  var year = date.getFullYear();
  var month = (`0${date.getMonth()}`).slice(-2);
  var day = (`0${date.getDate()}`).slice(-2);
  var hour = (`0${date.getHours()}`).slice(-2);
  var minutes = (`0${date.getMinutes()}`).slice(-2);
  var seconds = (`0${date.getSeconds()}`).slice(-2);
  
  return `${year}${month}${day}${hour}${minutes}${seconds}`//yyyyMMddhhmmss
}


function validate (req_body) {

  //Check it's valid SOAP
  //TODO: could use a library to validate the incoming request is valid xml
  var soapEnvelope = "soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'";
  var soapOk = req_body.indexOf(soapEnvelope);

  if (!soapOk) {
    return {
      valid: false, 
      validationError: fillErrorTemplate("soap:Client", "Invalid Soap Envelope")
    };
  }

  //Check valid HL7
  var hl7 = "urn:hl7-org:v2xml";
  var hl7Ok = req_body.indexOf(hl7);
  var qpdSegment = req_body.indexOf("QPD");

  if (qpdSegment === -1 || hl7Ok === -1) {
    return {
      valid: false,
      validationError: fillErrorTemplate("soap:Server", "Sorry, that might be a valid request but it's not supported by the Sandbox API"),
    };
  }

  return {
    valid: true
  };
};

function process(request){

  try {
    const {valid, validationError} = validate(request);
    if (!valid) {
      return validationError;
    }


    var doc = new xmlParser().parseFromString(request, 'text/xml');
    
    var xpathSelector = xpath.useNamespaces({ "urn": "urn:hl7-org:v2xml" })
    var QPD = xpathSelector("//urn:QPD", doc);
    var QPD3 = xpathSelector("//urn:QPD.3", doc); // Group of QPD.3


    const query = {};
    for (const item of QPD3) {    

      let QIP1 = xpathSelector("urn:QIP.1", item)[0].firstChild.data;
      let QIP2 = xpathSelector("urn:QIP.2", item)[0].firstChild.data;
      query[QIP1] = QIP2;
    }
    var id            = query["@PID.3.1"];
    var idIssuer      = query["@PID.3.4"];
    var idType        = query["@PID.3.5"];
    var surname       = query["@PID.5.1"];
    var name          = query["@PID.5.2"];
    var dateOfBirth   = query["@PID.7"];
    var postCode      = query["@PID.11.5"];

    var timestamp = toHl7DateFormat(Date.now());

    if ((id == "5555599226" && idIssuer == "NHS" && idType == "NH")
    ||(id == "E123679" && idIssuer == "129" && idType == "PI")
    ||(surname !== undefined && surname.toLowerCase() == "holmes" && postCode == "CF11 9AD")
    ||(surname !== undefined && surname.toLowerCase() == "holmes" && name !== undefined && name.toLowerCase() == "sherlock" && dateOfBirth == "19381108")) {
        return fillResponseTemplate(timestamp, QPD, results)
    }
    else {
        return fillResponseTemplate(timestamp, QPD, noResults);
    }
  }
  catch (err){
    console.log(err);
    return fillErrorTemplate("soap:Server", "Sorry, that might be a valid request but it's not supported by the Sandbox API");
  }

}

module.exports = {
  MPI_PDQ: { process }
}