const AWS = require("aws-sdk");
const http = require("http");
const globals = require("../globals");
const { memoize, MEMOIZE_CACHE_DURATION } = require("../memoize");

const logger = globals.LOGGER;
const config = globals.CURRENT_CONFIG;

const ddb = (globals.CURRENT_ENV_TYPE === globals.ENV_TYPES.LOCAL)
    ? new AWS.DynamoDB.DocumentClient({ region: config.aws.dynamodb.region, endpoint: new AWS.Endpoint(config.aws.dynamodb.localEndPoint) })
    : new AWS.DynamoDB.DocumentClient({
        region: config.aws.dynamodb.region,
        httpOptions: {
            agent: new http.Agent({
                keepAlive: true
            })
        },
        sslEnabled: false,
        paramValidation: false,
        convertResponseTypes: false
    });

const dynamoDb = (globals.CURRENT_ENV_TYPE === globals.ENV_TYPES.LOCAL)
  ? new AWS.DynamoDB({ region: config.aws.dynamodb.region, endpoint: new AWS.Endpoint(config.aws.dynamodb.localEndPoint) })
  : new AWS.DynamoDB({
      region: config.aws.dynamodb.region,
      httpOptions: {
          agent: new http.Agent({
              keepAlive: true
          })
      },
      sslEnabled: false,
      paramValidation: false,
      convertResponseTypes: false
  });

const tables = config.aws.dynamodb.tables;

const UNARY_FILTERS = new Set(["attribute_exists"]);

function constructFilter(field, operator, index) {
    const filter = (op => {
        switch (op) {
            case "attribute_exists":
                return `${op}(${field})`;
            case "attribute_not_exists":
                return `${op}(${field})`;
            case "begins_with":
            case "contains":
                return `${op}(#${field}${index},:${field}${index})`;
            case "between":
                return `(#${field} ${op} :${field}0 and :${field}1)`;
            default:
                return `#${field}${index}${op}:${field}${index}`;
        }
    })(operator);

    return filter;
}

async function createItem(type, keyValue, payload, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }

    const tablePrimaryKey = table.primaryKey;

    const mappedPayload = Object.keys(payload).reduce((obj, item) => (obj[item] = (Array.isArray(payload[item])) ? ddb.createSet(payload[item]) : payload[item], obj), {});

    const params = {
        TableName: tableName,
        Item: {
            [tablePrimaryKey]: keyValue,
            ...mappedPayload,
            created_at: new Date().getTime(),
        }
    };

    logger.info(`Creating ${type} ${keyValue}...`);

    return ddb.put(params).promise();
}

async function deleteItem(type, keyValue, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }
    const tablePrimaryKey = table.primaryKey;

    const params = {
        TableName: tableName,
        Key: {
            [tablePrimaryKey]: keyValue
        }
    };

    logger.info(`Deleting ${type} ${keyValue}...`);

    return ddb.delete(params).promise();
}

async function getAllItems(type, maybeFilters, platform, limit) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }

    var params = { TableName: tableName };

    const attributeValuesReducer = (obj, item, index) => {
        if(Array.isArray(item.value)) {
            return((item.value.forEach((val, key) => {
                obj[`:${item.field}${key}`] = val
            })), obj);
        } else {
            return (obj[`:${item.field}${index}`] = item.value , obj)
        }
    }

    const attributeNamesReducer = (obj, item, index) => {
        if(Array.isArray(item.value)) {
            return (obj[`#${item.field}`] = item.field , obj)
        } else {
            return (obj[`#${item.field}${index}`] = item.field , obj)
        }
    }

    if (maybeFilters) {
        const mappedExpressions = maybeFilters.map((filter, index) => constructFilter(filter.field, filter.operator, index));
        const mappedExpressionAttributeNames = maybeFilters.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce(attributeNamesReducer, {});
        const mappedExpressionAttributeValues = maybeFilters.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce(attributeValuesReducer, {});

        params["FilterExpression"] = mappedExpressions.join(" and ");

        if (Object.keys(mappedExpressionAttributeNames).length > 0 && Object.keys(mappedExpressionAttributeValues).length > 0) {
            params["ExpressionAttributeNames"] = mappedExpressionAttributeNames;
            params["ExpressionAttributeValues"] = mappedExpressionAttributeValues;
        }
    }

    if (limit) {
        params["Limit"] = limit;
    }

    return ddb.scan(params).promise();
}

async function getAllItemsWithQuery(type, maybeFilters, indexName, platform, limit) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }

    var params = { TableName: tableName };

    if(indexName) {
        params["IndexName"] = indexName;
    }

    const attributeValuesReducer = (obj, item, index) => {
        if(Array.isArray(item.value)) {
            return((item.value.forEach((val, key) => {
                obj[`:${item.field}${key}`] = val
            })), obj);
        } else {
            return (obj[`:${item.field}${index}`] = item.value , obj)
        }
    }

    const attributeNamesReducer = (obj, item, index) => {
        if(Array.isArray(item.value)) {
            return (obj[`#${item.field}`] = item.field , obj)
        } else {
            return (obj[`#${item.field}${index}`] = item.field , obj)
        }
    }

    if (maybeFilters) {
        const mappedExpressions = maybeFilters.map((filter, index) => constructFilter(filter.field, filter.operator, index));
        const mappedExpressionAttributeNames = maybeFilters.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce(attributeNamesReducer, {});
        const mappedExpressionAttributeValues = maybeFilters.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce(attributeValuesReducer, {});

        params["KeyConditionExpression"] = mappedExpressions.join(" and ");

        if (Object.keys(mappedExpressionAttributeNames).length > 0 && Object.keys(mappedExpressionAttributeValues).length > 0) {
            params["ExpressionAttributeNames"] = mappedExpressionAttributeNames;
            params["ExpressionAttributeValues"] = mappedExpressionAttributeValues;
        }
    }

    if (limit) {
        params["Limit"] = limit;
    }

    return ddb.query(params).promise();
}

const _getPlatformData = platformId => {
    logger.info(`Get Platform Cache miss. Going to get call API to get data against platform id ${platformId}`);
    return getItem(globals.MI_PLATFORM_TABLE, platformId)
      .then(data => {
          return data;
      })
      .catch(err => {
          logger.error(`Error in Platform data against platform ID ${platformId}`, err);
      });
};

const _m_getPlatformData = memoize(
  _getPlatformData,
  'dynamo_platform_getPlatformData',
  MEMOIZE_CACHE_DURATION
);

const getPlatformData = platformId => _m_getPlatformData(platformId);

function generateTableName(tableName, platform) {
    return getPlatformData(platform).then(platformData => {
        const platform = platformData.Item;
        if (platform && platform[globals.MI_PLATFORM_TABLE_ATTRIBUTES.TABLE_PREFIX]) {
            return platform[globals.MI_PLATFORM_TABLE_ATTRIBUTES.TABLE_PREFIX] + "_" + tableName;
        } else {
            return tableName;
        }
    })
}

async function getItem(type, keyValue, consistancyRead, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }
    const tablePrimaryKey = table.primaryKey;
    const params = {
        TableName: tableName,
        Key: {
            [tablePrimaryKey]: keyValue
        }
    };

    if(consistancyRead !== 'undefined') {
        params['ConsistentRead'] = true;
    }

    return ddb.get(params).promise()
        .then(itemInfo => {
            if (itemInfo.Item) {
                return Promise.resolve(itemInfo);
            }

            return Promise.reject(`Item ${keyValue} not found in table ${tableName}`);
        }).catch(err => {
            logger.error(`Failed to getItem for keyValue: ${keyValue} and tableName: ${tableName}: `, err);
            return Promise.reject(err);
        })
}

async function describeTable(type, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }
    const params = {
        TableName: tableName,
    };

    return dynamoDb.describeTable(params).promise()
      .then(tableInfo => {
          if (tableInfo.Table) {
              return Promise.resolve(tableInfo);
          }

          return Promise.reject(`Table not found ${tableName}`);
      }).catch(err => {
          logger.error(`Failed to describeTable for tableName: ${tableName}: `, err);
          return Promise.reject(err);
      })
}

async function incrementItem(type, keyValue, field, increment, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }
    const tablePrimaryKey = table.primaryKey;

    const updateExpression = `SET #${field} = #${field} + :inc`;
    const updateParams = {
        TableName: tableName,
        Key: {
            [tablePrimaryKey]: keyValue
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: {
            [`#${field}`]: field
        },
        ExpressionAttributeValues: {
            ":inc": increment
        },
        ReturnValues: "UPDATED_NEW"
    };

    return ddb.update(updateParams).promise();
}

async function updateItem(type, keyValue, updateMap, maybeConditionsExpression, platform) {
    const table = tables[type];
    let tableName = table.name;
    if (!tableName.startsWith(globals.MI_TABLE_PREFIX)) {
        tableName = await generateTableName(tableName, platform);
    }
    const tablePrimaryKey = table.primaryKey;

    function expressionStringGenerator(source, type) {
        function setStringTemplate(base, item) {
            return `${base} #${item}=:${item},`;
        }

        function collectionStringTemplate(base, item) {
            return `${base} ${item} :${item},`;
        }

        function removeStringTemplate(base, item) {
            return `${base} ${item},`;
        }

        const reducer = ((t) => {
            switch (t) {
                case "SET":
                    return setStringTemplate;
                case "ADD":
                case "DELETE":
                    return collectionStringTemplate;
                case "REMOVE":
                    return removeStringTemplate;
                default:
                    logger.error(`Unknown expression string type ${t}. Failed to generate update string`);
                    return null;
            }
        })(type);

        return (source.length > 0) ? source.reduce(reducer, type).replace(/(^,)|(,$)/g, "") : "";
    }

    function expressionNamesGenerator(source) {
        return source.reduce((obj, item) => (obj[`#${item}`] = item, obj), {});
    }

    function expressionValuesGenerator(source, sourceLookup) {
        return source.reduce((obj, item) => (obj[`:${item}`] = (Array.isArray(sourceLookup[item])) ? ddb.createSet(sourceLookup[item]) : sourceLookup[item], obj), {});
    }

    function processListItems(attributeKey, items) {
        function generateItemList(filterKey) {
            return items.filter(item => item.action === filterKey).map(item => item.value);
        }

        const addItems = generateItemList("ADD");
        const deleteItems = generateItemList("DELETE");

        return { ATTRIBUTE_KEY: attributeKey, ADD: addItems, DELETE: deleteItems };
    }

    function generateListItemParams(unpackedListItems, referenceList) {
        const filteredItems = unpackedListItems.filter(item => item[referenceList].length > 0);
        const filteredItemKeys = filteredItems.map(item => item.ATTRIBUTE_KEY);
        const listItemLookupTable = filteredItems.reduce((obj, item) => (obj[item.ATTRIBUTE_KEY] = item[referenceList], obj), {});

        const listItemUpdateExpression = expressionStringGenerator(filteredItemKeys, referenceList);
        const listItemUpdateExpressionAttributeValues = expressionValuesGenerator(filteredItemKeys, listItemLookupTable);

        return { EXPRESSION: listItemUpdateExpression, VALUES: listItemUpdateExpressionAttributeValues };
    }

    var baseUpdateParams = {
        TableName: tableName,
        Key: {
            [tablePrimaryKey]: keyValue
        },
        ReturnValues: "UPDATED_NEW"
    };

    const updateKeys = Object.keys(updateMap);

    const processedKeys = updateKeys.map(key => {
        const updateValue = updateMap[key];

        if (updateValue === null || updateValue === undefined) { // value is null
            return { action: "REMOVE", value: key };
        }
        else if (Array.isArray(updateValue)) {
            return { action: "LIST", value: key };
        }

        return { action: "SET", value: key };
    });

    var binnedProcessedKeys = processedKeys.reduce((obj, item) => (obj[item.action].push(item.value), obj), { SET: [], LIST: [], REMOVE: [] });
    const unpackedListItems = binnedProcessedKeys.LIST.map(key => processListItems(key, updateMap[key]));
    delete binnedProcessedKeys.LIST;

    const setString = expressionStringGenerator(binnedProcessedKeys.SET, "SET");
    const removeString = expressionStringGenerator(binnedProcessedKeys.REMOVE, "REMOVE");

    let setNames = expressionNamesGenerator(binnedProcessedKeys.SET);
    let setValues = expressionValuesGenerator(binnedProcessedKeys.SET, updateMap);
    let conditionExpression;

    if (maybeConditionsExpression) {
        const mappedExpressions = maybeConditionsExpression.map((filter, index) => constructFilter(filter.field, filter.operator, index));
        const mappedExpressionAttributeNames = maybeConditionsExpression.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce((obj, item, index) => (obj[`#${item.field}${index}`] = item.field, obj), {});
        const mappedExpressionAttributeValues = maybeConditionsExpression.filter(filter => !UNARY_FILTERS.has(filter.operator)).reduce((obj, item, index) => (obj[`:${item.field}${index}`] = item.value, obj), {});
        conditionExpression = mappedExpressions.join(" and ");
        if (Object.keys(mappedExpressionAttributeNames).length > 0 && Object.keys(mappedExpressionAttributeValues).length > 0) {
            setNames = {
                ...setNames,
                ...mappedExpressionAttributeNames
            }
            setValues = {
                ...setValues,
                ...mappedExpressionAttributeValues
            }
        }
    }

    const singleItemFullUpdateExpression = `${setString} ${removeString}`.trim();

    const maybeSetAndRemoveUpdate = new Promise((resolve, _) => {
        if (singleItemFullUpdateExpression.length === 0) {
            resolve();
        }
        else {
            var setAndRemoveUpdateParams = {
                ...baseUpdateParams,
                UpdateExpression: singleItemFullUpdateExpression
            };

            if (Object.keys(setValues).length > 0) {
                setAndRemoveUpdateParams = {
                    ...setAndRemoveUpdateParams,
                    ExpressionAttributeNames: setNames,
                    ExpressionAttributeValues: setValues,
                    ConditionExpression: conditionExpression
                }
            }

            ddb.update(setAndRemoveUpdateParams).promise().then(_ => resolve()).catch(err => {
                logger.error(`Failed to updateItem`, err);
                _(err);
            });
        }
    });

    logger.info(`Updating ${type} ${keyValue} with payload:`);
    logger.info(updateMap);

    return maybeSetAndRemoveUpdate
        .then(_ => {
            const deleteItemPayload = generateListItemParams(unpackedListItems, "DELETE");

            if (Object.keys(deleteItemPayload.VALUES).length === 0) {
                return Promise.resolve();
            }

            const deleteUpdateParams = {
                ...baseUpdateParams,
                UpdateExpression: deleteItemPayload.EXPRESSION,
                ExpressionAttributeValues: deleteItemPayload.VALUES
            };

            return ddb.update(deleteUpdateParams).promise();
        })
        .then(_ => {
            const addItemPayload = generateListItemParams(unpackedListItems, "ADD");

            if (Object.keys(addItemPayload.VALUES).length === 0) {
                return Promise.resolve();
            }

            const addUpdateParams = {
                ...baseUpdateParams,
                UpdateExpression: addItemPayload.EXPRESSION,
                ExpressionAttributeValues: addItemPayload.VALUES
            };

            return ddb.update(addUpdateParams).promise();

        }).catch(err => {
            logger.error(`Failed to updateItem: `, err);
            return Promise.reject(err);
        });
}

module.exports = {
    createItem,
    deleteItem,
    describeTable,
    getAllItems,
    getAllItemsWithQuery,
    getItem,
    incrementItem,
    updateItem
};
