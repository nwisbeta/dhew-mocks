const xpath = require("xpath");
const xmlParser = require("xmldom").DOMParser;

const fillErrorTemplate = function(code, message){
  return `<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><soap:Fault><faultcode>${code}</faultcode><faultstring>${message}</faultstring><detail/></soap:Fault></soap:Body></soap:Envelope>`
}
const fillResponseTemplate = function (date, qpdSegment , results) {
  return `<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'><soap:Body><InvokePatientDemographicsQueryResponse xmlns='http://apps.wales.nhs.uk/mpi/'><RSP_K21 xmlns='urn:hl7-org:v2xml'><MSH><MSH.1>|</MSH.1><MSH.2>^~\\&amp;</MSH.2><MSH.3><HD.1>100</HD.1></MSH.3><MSH.4><HD.1>100</HD.1></MSH.4><MSH.5><HD.1>218</HD.1></MSH.5><MSH.6><HD.1>218</HD.1></MSH.6><MSH.7><TS.1>${date}</TS.1></MSH.7><MSH.9><MSG.1>RSP</MSG.1><MSG.2>K22</MSG.2><MSG.3>RSP_K22</MSG.3></MSH.9><MSH.10>41</MSH.10><MSH.11><PT.1>P</PT.1></MSH.11><MSH.12><VID.1>2.5</VID.1></MSH.12><MSH.17>GBR</MSH.17><MSH.19><CE.1>EN</CE.1></MSH.19></MSH><MSA><MSA.1>AA</MSA.1><MSA.2>9783</MSA.2></MSA><QAK><QAK.1>PatientQuery</QAK.1><QAK.2>OK</QAK.2></QAK>${qpdSegment}${results}</RSP_K21></InvokePatientDemographicsQueryResponse></soap:Body></soap:Envelope>`
}

const results = {
  "sherlock": "<RSP_K21.QUERY_RESPONSE><PID><PID.1>001</PID.1><PID.3><CX.1>28905311</CX.1><CX.4><HD.1>100</HD.1></CX.4><CX.5>PE</CX.5></PID.3><PID.3><CX.1>E123679</CX.1><CX.4><HD.1>129</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>H8565187</CX.1><CX.4><HD.1>149</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>206385</CX.1><CX.4><HD.1>154</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>0000677299</CX.1><CX.4><HD.1>237</HD.1></CX.4><CX.5>PI</CX.5></PID.3><PID.3><CX.1>5555599226</CX.1><CX.4><HD.1>NHS</HD.1></CX.4><CX.5>NH</CX.5></PID.3><PID.5><XPN.1><FN.1>Holmes</FN.1></XPN.1><XPN.2>Sherlock</XPN.2><XPN.5>Mr</XPN.5><XPN.7>U</XPN.7></PID.5><PID.7><TS.1>19381108000000</TS.1></PID.7><PID.8>M</PID.8><PID.9><XPN.7>A</XPN.7></PID.9><PID.11><XAD.1><SAD.1>21 Cowbridge Road East</SAD.1></XAD.1><XAD.2>Riverside</XAD.2><XAD.3>Cardiff</XAD.3><XAD.4>South Glamorgan</XAD.4><XAD.5>CF11 9AD</XAD.5><XAD.7>H</XAD.7></PID.11><PID.13><XTN.1>07000 111111</XTN.1><XTN.2>PRN</XTN.2><XTN.4>sherlock.holmes@example.com</XTN.4></PID.13><PID.13><XTN.2>PRS</XTN.2></PID.13><PID.14><XTN.2>WPN</XTN.2></PID.14><PID.22><CE.1>A</CE.1></PID.22></PID><PD1><PD1.3><XON.3>W31111</XON.3></PD1.3><PD1.4><XCN.1>G3353251</XCN.1></PD1.4></PD1></RSP_K21.QUERY_RESPONSE>",
  "john": '<RSP_K21.QUERY_RESPONSE> <PID> <PID.1 Item="104" Type="SI" LongName="Set ID - PID">001</PID.1> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">28905311</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">100</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PE</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">E976321</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">129</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">H8565187</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">149</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">0000677299</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">237</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">405081779</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">154</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">405086351</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">154</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.5 Item="108" Type="XPN" LongName="Patient Name"> <XPN.1 Type="FN" LongName="Family Name"> <FN.1 Type="ST" LongName="Surname">Watson</FN.1> </XPN.1> <XPN.2 Type="ST" LongName="Given Name">John</XPN.2> <XPN.5 Type="ST" LongName="Prefix (e.g., DR)">Mr</XPN.5> <XPN.7 Type="ID" Table="HL70200" LongName="Name Type Code">U</XPN.7> </PID.5> <PID.7 Item="110" Type="TS" LongName="Date/Time of Birth"> <TS.1 Type="DTM" LongName="Time">19520807000000</TS.1> </PID.7> <PID.8 Item="111" Type="IS" Table="HL70001" LongName="Administrative Sex">M</PID.8> <PID.9 Item="112" Type="XPN" LongName="Patient Alias"> <XPN.7 Type="ID" Table="HL70200" LongName="Name Type Code">A</XPN.7> </PID.9> <PID.11 Item="114" Type="XAD" LongName="Patient Address"> <XAD.1 Type="SAD" LongName="Street Address"> <SAD.1 Type="ST" LongName="Street or Mailing Address">Coed-Y-Wiw</SAD.1> </XAD.1> <XAD.2 Type="ST" LongName="Other Designation">Llanharry</XAD.2> <XAD.3 Type="ST" LongName="City">Pontyclun</XAD.3> <XAD.4 Type="ST" LongName="State or Province">Rhondda, cynon, taff</XAD.4> <XAD.5 Type="ST" LongName="Zip or Postal Code">CF72 9LZ</XAD.5> <XAD.7 Type="ID" Table="HL70190" LongName="Address Type">H</XAD.7> </PID.11> <PID.13 Item="116" Type="XTN" LongName="Phone Number - Home"> <XTN.1 Type="ST" LongName="Telephone Number">07832 634746</XTN.1> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">PRN</XTN.2> <XTN.4 Type="ST" LongName="Email Address">john.watson@example.com</XTN.4> </PID.13> <PID.13 Item="116" Type="XTN" LongName="Phone Number - Home"> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">PRS</XTN.2> </PID.13> <PID.14 Item="117" Type="XTN" LongName="Phone Number - Business"> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">WPN</XTN.2> </PID.14> <PID.22 Item="125" Type="CE" Table="HL70189" LongName="Ethnic Group"> <CE.1 Type="ST" LongName="Identifier">A</CE.1> </PID.22> </PID> </RSP_K21.QUERY_RESPONSE>',
  "martha": '<RSP_K21.QUERY_RESPONSE> <PID> <PID.1 Item="104" Type="SI" LongName="Set ID - PID">001</PID.1> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">28906432</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">100</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PE</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">E231796</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">129</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">H8567543</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">149</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">405088412</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">154</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">0000677432</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">237</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">5555597531</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">NHS</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">NH</CX.5> </PID.3> <PID.5 Item="108" Type="XPN" LongName="Patient Name"> <XPN.1 Type="FN" LongName="Family Name"> <FN.1 Type="ST" LongName="Surname">HUDSON</FN.1> </XPN.1> <XPN.2 Type="ST" LongName="Given Name">MARTHA</XPN.2> <XPN.5 Type="ST" LongName="Prefix (e.g., DR)">Mrs</XPN.5> <XPN.7 Type="ID" Table="HL70200" LongName="Name Type Code">U</XPN.7> </PID.5> <PID.7 Item="110" Type="TS" LongName="Date/Time of Birth"> <TS.1 Type="DTM" LongName="Time">19390321000000</TS.1> </PID.7> <PID.8 Item="111" Type="IS" Table="HL70001" LongName="Administrative Sex">M</PID.8> <PID.9 Item="112" Type="XPN" LongName="Patient Alias"> <XPN.7 Type="ID" Table="HL70200" LongName="Name Type Code">A</XPN.7> </PID.9> <PID.11 Item="114" Type="XAD" LongName="Patient Address"> <XAD.1 Type="SAD" LongName="Street Address"> <SAD.1 Type="ST" LongName="Street or Mailing Address">Coed-Y-Wiw</SAD.1> </XAD.1> <XAD.2 Type="ST" LongName="Other Designation">Llanharry</XAD.2> <XAD.3 Type="ST" LongName="City">Pontyclun</XAD.3> <XAD.4 Type="ST" LongName="State or Province">Rhondda, cynon, taff</XAD.4> <XAD.5 Type="ST" LongName="Zip or Postal Code">CF72 9LZ</XAD.5> <XAD.7 Type="ID" Table="HL70190" LongName="Address Type">H</XAD.7> </PID.11> <PID.13 Item="116" Type="XTN" LongName="Phone Number - Home"> <XTN.1 Type="ST" LongName="Telephone Number">07731 412343</XTN.1> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">PRN</XTN.2> <XTN.4 Type="ST" LongName="Email Address">martha.hudson@example.com</XTN.4> </PID.13> <PID.13 Item="116" Type="XTN" LongName="Phone Number - Home"> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">PRS</XTN.2> </PID.13> <PID.14 Item="117" Type="XTN" LongName="Phone Number - Business"> <XTN.2 Type="ID" Table="HL70201" LongName="Telecommunication Use Code">WPN</XTN.2> </PID.14> <PID.22 Item="125" Type="CE" Table="HL70189" LongName="Ethnic Group"> <CE.1 Type="ST" LongName="Identifier">A</CE.1> </PID.22> <PID.29 Item="110" Type="TS" LongName="Patient Death Date and Time"> <TS.1 Type="DTM" LongName="Time">20200310141500</TS.1> </PID.29> </PID> <PD1> <PD1.3 Item="756" Type="XON" LongName="Patient Primary Facility"> <XON.3 Type="NM" LongName="ID Number">W31111</XON.3> </PD1.3> <PD1.4 Item="757" Type="XCN" LongName="Patient Primary Care Provider Name &amp; ID No."> <XCN.1 Type="ST" LongName="ID Number">G3353251</XCN.1> </PD1.4> </PD1> </RSP_K21.QUERY_RESPONSE> <RSP_K21.QUERY_RESPONSE> <PID> <PID.1 Item="104" Type="SI" LongName="Set ID - PID">002</PID.1> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">309551452</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">100</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PE</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">2014524</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">154</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">PI</CX.5> </PID.3> <PID.3 Item="106" Type="CX" LongName="Patient Identifier List"> <CX.1 Type="ST" LongName="ID Number">5555599226</CX.1> <CX.4 Type="HD" Table="HL70363" LongName="Assigning Authority"> <HD.1 Type="IS" Table="HL70300" LongName="Namespace ID">NHS</HD.1> </CX.4> <CX.5 Type="ID" Table="HL70203" LongName="Identifier Type Code">NH</CX.5> </PID.3> <PID.5 Item="108" Type="XPN" LongName="Patient Name"> <XPN.1 Type="FN" LongName="Family Name"> <FN.1 Type="ST" LongName="Surname">HUDSON</FN.1> </XPN.1> <XPN.2 Type="ST" LongName="Given Name">MARTHA</XPN.2> <XPN.7 Type="ID" Table="HL70200" LongName="Name Type Code">U</XPN.7> </PID.5> <PID.7 Item="110" Type="TS" LongName="Date/Time of Birth"> <TS.1 Type="DTM" LongName="Time">19390321000000</TS.1> </PID.7> <PID.8 Item="111" Type="IS" Table="HL70001" LongName="Administrative Sex">F</PID.8> <PID.11 Item="114" Type="XAD" LongName="Patient Address"> <XAD.1 Type="SAD" LongName="Street Address"> <SAD.1 Type="ST" LongName="Street or Mailing Address">221B Baker Street</SAD.1> </XAD.1> <XAD.7 Type="ID" Table="HL70190" LongName="Address Type">H</XAD.7> </PID.11> </PID> </RSP_K21.QUERY_RESPONSE>'
}
 
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

function determinePatient(query)
{
  var id            = query["@PID.3.1"];
  var idIssuer      = query["@PID.3.4"];
  var idType        = query["@PID.3.5"];
  var surname       = query["@PID.5.1"];
  var name          = query["@PID.5.2"];
  var dateOfBirth   = query["@PID.7"];
  var postCode      = query["@PID.11.5"];

  if ((id == "5555599226" && idIssuer == "NHS" && idType == "NH")
    ||(id == "E123679" && idIssuer == "129" && idType == "PI")
    ||(surname !== undefined && surname.toLowerCase() == "holmes" && postCode == "CF11 9AD")
    ||(surname !== undefined && surname.toLowerCase() == "holmes" && name !== undefined && name.toLowerCase() == "sherlock" && dateOfBirth == "19381108")) {
        return 'sherlock';
  }

  if ((id == "E976321" && idIssuer == "129" && idType == "PI")
    ||(surname !== undefined && surname.toLowerCase() == "watson" && postCode == "CF12 9AD")
    ||(surname !== undefined && surname.toLowerCase() == "watson" && name !== undefined && name.toLowerCase() == "john" && dateOfBirth == "19520807")) {
        return 'john';
  }

  if ((id == "5543223455" && idIssuer == "NHS" && idType == "NH")
    ||(id == "E231796" && idIssuer == "129" && idType == "PI")
    ||(surname !== undefined && surname.toLowerCase() == "hudson" && postCode == "CF13 9AD")
    ||(surname !== undefined && surname.toLowerCase() == "hudson" && name !== undefined && name.toLowerCase() == "martha" && dateOfBirth == "19390321")) {
        return 'martha';
  }

  return null;
}

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
    
    var timestamp = toHl7DateFormat(Date.now());
    var patient = determinePatient(query);

    if(patient === null) {
      return fillResponseTemplate(timestamp, QPD, noResults);
    }

    return fillResponseTemplate(timestamp, QPD, results[patient])
  }
  catch (err){
    console.log(err);
    return fillErrorTemplate("soap:Server", "Sorry, that might be a valid request but it's not supported by the Sandbox API");
  }

}

module.exports = {
  MPI_PDQ: { process }
}