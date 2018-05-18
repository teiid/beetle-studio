import { QueryResults } from "@dataservices/shared/query-results.model";

describe("QueryResults", () => {
  let queryResults: QueryResults;

  const employeeJson = {
    "columns": [
      {
        "name": "ssn",
        "label": "ssn",
        "type": "string"
      },
      {
        "name": "firstname",
        "label": "firstname",
        "type": "string"
      },
      {
        "name": "lastname",
        "label": "lastname",
        "type": "string"
      },
      {
        "name": "st_address",
        "label": "st_address",
        "type": "string"
      },
      {
        "name": "apt_number",
        "label": "apt_number",
        "type": "string"
      },
      {
        "name": "city",
        "label": "city",
        "type": "string"
      },
      {
        "name": "state",
        "label": "state",
        "type": "string"
      },
      {
        "name": "zipcode",
        "label": "zipcode",
        "type": "string"
      },
      {
        "name": "phone",
        "label": "phone",
        "type": "string"
      }
    ],
    "rows": [
      {
        "row": [
          "CST01002  ",
          "Joseph",
          "Smith",
          "1234 Main Street",
          "Apartment 56",
          "New York",
          "New York",
          "10174",
          "(646)555-1776"
        ]
      },
      {
        "row": [
          "CST01003  ",
          "Nicholas",
          "Ferguson",
          "202 Palomino Drive",
          "",
          "Pittsburgh",
          "Pennsylvania",
          "15071",
          "(412)555-4327"
        ]
      },
      {
        "row": [
          "CST01004  ",
          "Jane",
          "Aire",
          "15 State Street",
          "",
          "Philadelphia",
          "Pennsylvania",
          "19154",
          "(814)555-6789"
        ]
      },
      {
        "row": [
          "CST01005  ",
          "Charles",
          "Jones",
          "1819 Maple Street",
          "Apartment 17F",
          "Stratford",
          "Connecticut",
          "06614",
          "(203)555-3947"
        ]
      },
      {
        "row": [
          "CST01006  ",
          "Virginia",
          "Jefferson",
          "1710 South 51st Street",
          "Apartment 3245",
          "New York",
          "New York",
          "10175",
          "(718)555-2693"
        ]
      },
      {
        "row": [
          "CST01007  ",
          "Ralph",
          "Bacon",
          "57 Barn Swallow Avenue",
          "",
          "Charlotte",
          "North Carolina",
          "28205",
          "(704)555-4576"
        ]
      },
      {
        "row": [
          "CST01008  ",
          "Bonnie",
          "Dragon",
          "88 Cinderella Lane",
          "",
          "Jacksonville",
          "Florida",
          "32225",
          "(904)555-6514"
        ]
      },
      {
        "row": [
          "CST01009  ",
          "Herbert",
          "Smith",
          "12225 Waterfall Way",
          "Building 100, Suite 9",
          "Portland",
          "Oregon",
          "97220",
          "(971)555-7803"
        ]
      },
      {
        "row": [
          "CST01015  ",
          "Jack",
          "Corby",
          "1 Lone Star Way",
          "",
          "Dallas",
          "Texas",
          "75231",
          "(469)555-8023"
        ]
      },
      {
        "row": [
          "CST01019  ",
          "Robin",
          "Evers",
          "1814 Falcon Avenue",
          "",
          "Atlanta",
          "Georgia",
          "30355",
          "(470)555-4390"
        ]
      }
    ]
  };

  beforeEach(() => {
    queryResults = null;
  });

  it("should create", () => {
    console.log("========== [QueryResults] should create");
    queryResults = new QueryResults(employeeJson);

    expect(queryResults.getColumns().length).toEqual(9);
    expect(queryResults.getRows().length).toEqual(10);
  });

});
