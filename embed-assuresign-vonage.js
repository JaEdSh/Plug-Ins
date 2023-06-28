import {css, html, LitElement, styleMap, until} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class EmbeddedVonAssureSign extends LitElement {
    
    static properties = {
        src: { type: String },
        content: { type : String },
        envelopeName: { type: String },
        height: { type: String },
        signerName: { type: String },
        signerEmail: { type: String },
        signerPhone: { type: String },
        assureSignApiUsername: { type: String },
        assureSignApiKey: { type: String },
        assureSignTemplateId: { type: String }
    }
    
    static getMetaConfig() {
        // plugin contract information
        return {
            controlName: 'Embedded-AssureSign-Von',
            fallbackDisableSubmit: false,
            description: 'IFrame component which can render AssureSign envelope',
            iconUrl: "pen",
            groupName: 'signature',
            version: '1.3',
            properties: {
                height: {
                    type: 'string',
                    title: 'Height',
                    description: 'Height of the component',
                },
                envelopeName: {
                    type: 'string',
                    title: 'Envelope Name'
                },
                signerEmail: {
                    type: 'string',
                    title: 'Signer Email'
                },
                signerName: {
                    type: 'string',
                    title: 'Signer Name'
                },
                signerPhone: {
                    type: 'string',
                    title: 'Signer Phone Number'
                },
                assureSignApiUsername: {
                    type: 'string',
                    title: 'AssureSign API Username'
                },
                assureSignApiKey: {
                    type: 'string',
                    title: 'AssureSign API Key'

                },
                assureSignApiUserEmail: {
                    type: 'string',
                    title: 'AssureSign API Context Email'
                },
                assureSignTemplateId: {
                    type: 'string',
                    title: 'AssureSign template Id'
                },
                NameOnAccount: {
                    type: 'string',
                    title: 'Name on Account'
                },
                BusinessName: {
                    type: 'string',
                    title: 'Business Name'
                },
                AuthorizingName: {
                    type: 'string',
                    title: 'Authorizing Name'
                },
                Country: {
                    type: 'string',
                    title: 'Country'
                },
                ServiceAddress: {
                    type: 'string',
                    title: 'Service Address'
                },
                ServiceAddressLineTwo: {
                    type: 'string',
                    title: 'Service Address 2'
                },
                City: {
                    type: 'string',
                    title: 'City'
                },
                ZipCode: {
                    type: 'string',
                    title: 'Zip Code'
                },
                AccountNumber: {
                    type: 'string',
                    title: 'Account Number'
                },
                AccountPhoneNumber: {
                    type: 'string',
                    title: 'Account Phone Number'
                },
                PINPass: {
                    type: 'string',
                    title: 'PIN Password'
                },
                RequestStartDate: {
                    type: 'string',
                    title: 'Request Start Date'
                },
                CurrentProvider: {
                    type: 'string',
                    title: 'Current Provider'
                },
                RequestedNumbers: {
                    type: 'string',
                    title: 'Requested Numbers'
                },
                value: {
                    type: 'string',
                    title: 'Value',
                    isValueField: true,
                },
            },
            events: ["ntx-value-change"],
            standardProperties: {
                readOnly: true,
                description: true,
            }
        };
    }
    
    _onChange(e) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            // value coming from input change event. 
            detail: this.value,
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }

    async load() {
        const apiUserBody = {
            "request": {
              "apiUsername": this.assureSignApiUsername,
              "key": this.assureSignApiKey,
              "contextUsername": this.assureSignApiUserEmail,
              "sessionLengthInMinutes": 60
            }
        };

        console.log('pre-load');

        const response = await fetch('https://account.assuresign.net/api/v3.7/authentication/apiUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiUserBody)
        });
        
        console.log('Getting token');
        const jsonResponse = await response.json();

        const token = jsonResponse.result.token;

        const submitBody = {
            "request": {
                "placeholders": [
                    {
                        "name":"NameOnAccount",
                        "value": this.NameOnAccount
                    },
                    {
                        "name":"BusinessName",
                        "value": this.BusinessName
                    },
                    {
                        "name":"AuthorizingName",
                        "value": this.AuthorizingName
                    },
                    {
                        "name":"Country",
                        "value": this.Country
                    },
                    {
                        "name":"ServiceAddress",
                        "value": this.ServiceAddress
                    },
                    {
                        "name":"ServiceAddressContinued",
                        "value": this.ServiceAddressLineTwo
                    },
                    {
                        "name":"City",
                        "value": this.City
                    },
                    {
                        "name":"ZipCode",
                        "value": this.ZipCode
                    },
                    {
                        "name":"AccountNumber",
                        "value": this.AccountNumber
                    },
                    {
                        "name":"AccountPhoneNumber",
                        "value": this.AccountPhoneNumber
                    },
                    {
                        "name":"PINPass",
                        "value": this.PINPass
                    },
                    {
                        "name":"RequestStartDate",
                        "value": this.RequestStartDate
                    },
                    {
                        "name":"CurrentProvider",
                        "value": this.CurrentProvider
                    },
                    {
                        "name":"RequestedNumbers",
                        "value": this.RequestedNumbers
                    }
                ],
                "templates": [
                    {
                        "templateID": this.assureSignTemplateId,
                        "values": [
                            {
                                "name": "Envelope Name 2 ",
                                "value": this.envelopeName
                            },
                            {
                                "name": "Language",
                                "value": "en-US"
                            },
                            {
                                "name": "Signer 1 Name",
                                "value": this.signerName
                                },
                            {
                                "name": "Signer 1 Email",
                                "value": this.signerEmail
                            },
                            {
                                "name": "Signer 1 Phone",
                                "value": this.signerPhone
                            }
                        ]
                    }
                ]
            }
        }

        /*if(((this.NameOnAccount != null && this.NameOnAccount != "")|| (this.BusinessName  != null && this.BusinessName != "" && this.AuthorizingName != null && this.AuthorizingName != "")) && this.Country != null 
        && this.Country != "" && this.ServiceAddress != null && this.ServiceAddress != "" && this.City != null && this.City != "" && this.ZipCode != null && this.ZipCode != "" && this.AccountNumber != null 
        && this.AccountNumber != "" && this.AccountPhoneNumber != null && this.AccountPhoneNumber != "" && this.RequestStartDate != null && this.RequestStartDate != "" && this.CurrentProvider != null 
        && this.CurrentProvider != "" && this.RequestedNumbers != null && this.RequestedNumbers != "" && this.assureSignTemplateId != null && this.assureSignTemplateId != "" && this.envelopeName != null 
        && this.envelopeName != "" && this.signerName != null && this.signerName != "" && this.signerEmail != null && this.signerEmail != ""){
            console.log('starting envelope');
            const submit = await fetch('https://sb.assuresign.net/api/documentnow/v3.7/submit',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitBody)
            });*/
            console.log('starting envelope');
            const submit = await fetch('https://sb.assuresign.net/api/documentnow/v3.7/submit',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitBody)});

            const jsonSubmit = await submit.json();
            
            console.log('envelope submitted');
            const envelopeId = jsonSubmit.result.envelopeID;
            if (!envelopeId == null){
                console.log('getting url');
                const signingLinks = await fetch('https://sb.assuresign.net/api/documentnow/v3.7/envelope/'+ envelopeId +'/signingLinks',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            const jsonSigningLinks = await signingLinks.json();
            
            this.value =  jsonSigningLinks.result.signingLinks[0].url;
            return this.value
        //}
    }

    constructor() {
        super();
        this.envelopeName = 'Envelope Name'
    }

    async connectedCallback() {
        super.connectedCallback();
        console.log(document.querySelector(".GetSigningDoc > div > div"));
        document.querySelector(".GetSigningDoc > div > div").addEventListener('change', function(){
                console.log('path text: ' + document.querySelector(".GetSigningDoc > div > div > div").innerHTML);
                if (document.querySelector(".GetSigningDoc > div > div > div").innerHTML == 'true'){
                    console.log('success');
                    this.content = this.load();
                }
            });        
    };

    
    // Render the UI as a function of component state
    render() {
        return ""
    }
}

// registering the web component.
const elementName = 'embedded-assuresign-vonage';
customElements.define(elementName, EmbeddedVonAssureSign);