import { ContactContent } from './features/contact/slice';

export const defaultContacts: ContactContent[] = [{
  "name": "Jaime Banks",
  "phone": "(08) 9345 2040",
  "email": "jbanks298@sknabemiaj.net",
  "address": "995 Harrison Loop\nFresno, Utah 16361"
}, {
  "name": "Angelina Pham",
  "phone": "780-752-4296",
  "email": "apham153@mahpanilegna.biz",
  "address": "987 Buchanan Lane\nCharleston, Kansas 96551"
}, {
  "name": "Bradley Norton",
  "phone": "0131 240 0801",
  "email": "bnorton872@notronyeldarb.net",
  "address": "172 7th Lane\nColorado Springs, Louisiana 75953"
}, {
  "name": "Ebony Montgomery",
  "phone": "01934 623526",
  "email": "emontgomery714@yremogtnomynobe.com",
  "address": "768 McKinley Alley\nNorfolk, Wyoming 99290"
}, {
  "name": "Jordan Moreno",
  "phone": "(814) 542-4414",
  "email": "jmoreno470@oneromnadroj.com",
  "address": "161 Pecan Loop\nPasadena, Minnesota 65295"
}];

export default {
  datastorePath: "./contacts.data",
  defaultContacts,
};