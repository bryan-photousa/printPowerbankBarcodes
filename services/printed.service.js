const axios = require("axios");
const env = require("../config/env");
//env.config()
const headers = { 
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'OP-USER-TOKEN': 'fH57Jti',
  'COAST-TOKEN': 't6cscuN9aU'
}; 
const url = env.url;
//console.log(process);
//console.log(process.env)
console.log(url)
const baseUrl = `${url}/change_order_item_list_to_printed`;
const ipUrl = `${env.ipUrl}/change_order_item_list_to_printed`;

module.exports = {
  setToPrinted: setToPrinted,
  iprintSetToPrinted: iprintSetToPrinted
}

function setToPrinted(data) {
  const config = {
    method: "POST",
    headers,
    data: data
  }
  return axios(`${baseUrl}`, config).then(responseSuccessHandler).catch(responseErrorHandler)
}

function iprintSetToPrinted(data) {
  const config = {
    method: "POST",
    headers,
    data: data
  }
  return axios(`${ipUrl}`, config).then(responseSuccessHandler).catch(responseErrorHandler)
}

const responseSuccessHandler = response => {
  return response.data;
};
    
const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};