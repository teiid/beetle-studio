/* tslint:disable:max-line-length */

/*
 * TODO
 * This file should be ported to a proper i18n translation module
 */

/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class OdataConstants {

  public readonly UrlNotAvailable = 'URL Not Available';

  public readonly AscendingChoice = "Asc";
  public readonly columnPlaceholder = "column";
  public readonly Columns = "Columns";
  public readonly conditionPlaceholder = "condition";
  public readonly dataServiceDeploymentFailedMessage = "The Data Service failed to activate.  Please correct the problem and retry";
  public readonly deployingDataService = "Deploying data service";
  public readonly DescendingChoice = "Desc";
  public readonly endpointNotAvailableMsg = "The endpoint is not available";
  public readonly enterQueryMsg = "Enter an SQL query to test the Data Service";
  public readonly failedDeploymentMsg = "The Data Service could not be deployed:";
  public readonly NoSortChoice = "No sort";
  public readonly OData = "OData";
  public readonly ODataEndpoint = "OData Endpoint: ";
  public readonly resultLimitPlaceholder = "Select result limit...";
  public readonly resultsTabular = "Tabular";
  public readonly resultsRaw = "Raw";
  public readonly runningOdataMetadataFetch = "Fetching OData metadata ...";
  public readonly runningOdataQuery = "Running OData query...";
  public readonly runQueryAction = "Submit";
  public readonly Select = "Select";

  public readonly selectResultLimitMsg = "Select the number of results to be initially returned";
  public readonly selectViewMsg = "Select the view to be queried";
  public readonly selectViewPlaceholder = "Select a view in the list...";
  public readonly SQL = "SQL";
  public readonly testingJdbcConnection = "Testing JDBC connection";
  public readonly urlPath = "Test URL";
  public readonly valuePlaceholder = "value";
  public readonly Where = "Where";
  public readonly OrderBy = "Order By";
  public readonly ResultFormat = "Format";

  public readonly noResultsColumnName = "Err: No Data!";
  public readonly noResultsMsg = "No data was returned from the query";
  public readonly resultCountMsg = "The total number of results returned by the query is ";
  public readonly searchErrorColumnName = "Err: Failed!";
  public readonly searchErrorConsoleMsg = "Error: Failed to get value at link: ";
  public readonly searchErrorMsg = "Error: failed to get any results: ";
  public readonly whereErrorMsg = "The chosen column has a type which cannot be used in a where condition";
  public readonly metadataFetchFailure = "Failed to get the odata metadata for the published artifact.";

  public readonly help_endpointSubmit = "This URL is formed using the OData specification. It can be copied into a new browser window to return the results in xml format or append ?format=json to the URL for JSON.  Click the Submit button to display the results in a formatted table.";
  public readonly help_select = "Choose the view from which results should be sought. Select a limit to curtail the number of results returned ";
  public readonly help_columns = "Select the columns to be included in the results.";
  public readonly help_where = "Create where clauses for filtering the results based on the values in each tuple. Use the + button to add new where clauses (clauses are and-ed together) and remove them with the - buttons.";
  public readonly help_orderBy = "Sort the results by column in ascending or descending order.";
  public readonly help_format = "Choose the format of the query results.";
  public readonly help_resultsTable = "Use the column headers to sort the results or filter them by entering values. Results are paginated in blocks of 25 and can be scrolled through with the controls at the foot of the table.";
  public readonly help_resultsRaw = "The raw data as returned from the odata teiid service in json format.";
  public readonly help_sqlSearch = "Use the Teiid dialect of SQL to construct a query that interrogates the data service for data results. Use the record limit to limit the number of results returned. Set the starting record index to fetch a subset of results starting at the given row index.";
}
