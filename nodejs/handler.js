const uuid = require("uuid");
const globals = require("./globals");
const utils = require("./utils");
const endpoints = require("./endpoints");

const logger = globals.LOGGER;

// BEGIN HELPERS

function getAllSessions(maybeFilters) {
    const filters = maybeFilters || [];
    const EQUALS_OPERATOR = "=";

    const equalsMappedFilters = filters.map(filter => {
        return { ...filter, operator: EQUALS_OPERATOR }
    })

    const stringifiedFilters = utils.stringifyParsedObject(equalsMappedFilters);

    const queryArgs = (filters.length > 0) ? [globals.INTERNAL_TYPE, stringifiedFilters] : [globals.INTERNAL_TYPE];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbGetAllItems, queryArgs);
}

function performAirtableUpdate(sessionId, airtableUpdate) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const airtableId = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.AIRTABLE_ID];

            const airtablePayload = utils.pruneFalsyObjectEntries(airtableUpdate);
            const stringifiedAirtableUpdate = utils.stringifyParsedObject(airtablePayload);
            const airtableQueryArgs = [globals.INTERNAL_TYPE, airtableId, stringifiedAirtableUpdate];

            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.updateRecord, airtableQueryArgs);
        });
}

function performLiveStateUpdate(sessionId, userId, state, update) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingStates = parsedSessionInfo[state] || {};

            const stateUpdate = {
                ...existingStates,
                [userId]: update
            };

            const dataUpdate = {
                [state]: stateUpdate
            };

            const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
            const dataUpdateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, dataUpdateQueryArgs);
        });
}

function performLiveTrainerSpeakingStateUpdate(sessionId, update) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};

            const speakingStateUpdate = Object.keys(existingSpeakingStates).reduce((state, key) => {
                return { ...state, [key]: update };
            }, {});

            const dataUpdate = {
                [globals.STANDARD_ATTRIBUTES.SPEAKING_STATES]: speakingStateUpdate
            };

            const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
            const dataUpdateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, dataUpdateQueryArgs);
        });
}

function performLiveTrainerVideoStateUpdate(sessionId, videoState) {
    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.VIDEO_STATE]: videoState
    };

    const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
    const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs);
}

function removeAllCustomersAndTrainer(sessionId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const customers = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SIGNUPS] || [];
            const trainerId = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.TRAINER];

            const customerUnlinks = customers.map(customerId => {
                const queryArgs = [customerId, sessionId];
                return utils.issueRequest(endpoints.customerService, endpoints.customerService.routes.unlinkSession, queryArgs);
            });

            const allCustomerUnlinks = Promise.all(customerUnlinks);

            const trainerQueryArgs = [trainerId, sessionId];
            const trainerUnlink = (trainerId) ? utils.issueRequest(endpoints.trainerService, endpoints.trainerService.routes.unlinkSession, trainerQueryArgs) : Promise.resolve();

            const allUnlinks = [allCustomerUnlinks, trainerUnlink];

            return Promise.all(allUnlinks);
        });
}

// END HELPERS

// BEGIN QUERY HANDLERS

function getKey(sessionId, userId) {
    const queryArgs = [sessionId, userId];

    return utils.issueRequest(endpoints.twilioService, endpoints.twilioService.routes.conferenceKey, queryArgs)
        .then(roomKeyInfo => {
            const roomKey = roomKeyInfo.data.key;
            return utils.formatSuccessResponse(roomKey);
        })
        .catch(err => {
            logger.error(`Failed to get session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function getMaxCapacity() {
    const cap = globals.MAX_CAPACITY;
    return utils.formatSuccessResponse(cap);
}

function getSession(sessionId) {
    const queryArgs = [globals.INTERNAL_TYPE, sessionId];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbGetItem, queryArgs)
        .then(sessionInfo => {
            const sessionContent = sessionInfo.data.content;
            return utils.formatSuccessResponse(sessionContent);
        })
        .catch(err => {
            logger.error(`Failed to get session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function getSessionAll(maybeFilter, maybeOperator) {
    
    const filters = [
        { field: globals.STANDARD_ATTRIBUTES.START_DATE_TIME , value: maybeFilter || new Date().toISOString()}
    ];

    const operator = maybeOperator || ">=";

    const equalsMappedFilters = filters.map(filter => {
        return { ...filter, operator: operator }
    })

    const stringifiedFilters = utils.stringifyParsedObject(equalsMappedFilters);
    const queryArgs = (filters.length > 0) ? [globals.INTERNAL_TYPE, stringifiedFilters] : [globals.INTERNAL_TYPE];
    
    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbGetAllItems, queryArgs)
        .then(sessionInfo => {
            const sessionContent = sessionInfo.data.content;
            return utils.formatSuccessResponse(sessionContent);
        })
        .catch(err => {
            logger.error(`Failed to get sessions`, err);
            return utils.formatErrorResponse(err);
        });
}

// END QUERY HANDLERS

// BEGIN MUTATION HANDLERS

function addCustomer(sessionId, customerId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingRoomStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.ROOM_STATES] || {};
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};
            const currentCustomers = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SIGNUPS] || [];
            const trainerId = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.TRAINER];
            const isFull = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.IS_FULL];

            if (JSON.parse(isFull)) {
                return Promise.reject("Session is full.");
            }

            const willBeFull = currentCustomers.length + 1 >= globals.MAX_CAPACITY;
            const signupUpdate = [{ action: globals.SET_OPERATIONS.ADD, value: customerId }];
            const currentTrainerSpeakingState = (trainerId) ? existingSpeakingStates[trainerId] : null;

            const roomStateUpdate = {
                ...existingRoomStates,
                [customerId]: globals.ROOM_STATES.OFFLINE
            };

            const speakingStateUpdate = {
                ...existingSpeakingStates,
                [customerId]: currentTrainerSpeakingState || globals.SPEAKING_STATES.SPEAKING
            };

            const dataUpdate = {
                [globals.STANDARD_ATTRIBUTES.IS_FULL]: willBeFull,
                [globals.STANDARD_ATTRIBUTES.ROOM_STATES]: roomStateUpdate,
                [globals.STANDARD_ATTRIBUTES.SIGNUPS]: signupUpdate,
                [globals.STANDARD_ATTRIBUTES.SPEAKING_STATES]: speakingStateUpdate
            };

            const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
            const dataUpdateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, dataUpdateQueryArgs);
        })
        .then(_ => {
            const linkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.SIGNUPS, globals.FOREIGN_TYPES.CUSTOMER, customerId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.linkRecord, linkQueryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to add customer to session ${sessionId}`, { sessionId, customerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function addTrainer(sessionId, trainerId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingRoomStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.ROOM_STATES] || {};
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};

            const roomStateUpdate = {
                ...existingRoomStates,
                [trainerId]: globals.ROOM_STATES.OFFLINE
            };

            const speakingStateUpdate = {
                ...existingSpeakingStates,
                [trainerId]: globals.SPEAKING_STATES.SPEAKING
            };

            const dataUpdate = {
                [globals.STANDARD_ATTRIBUTES.PAUSED]: true,
                [globals.STANDARD_ATTRIBUTES.ROOM_STATES]: roomStateUpdate,
                [globals.STANDARD_ATTRIBUTES.RUN_TIME]: 0,
                [globals.STANDARD_ATTRIBUTES.SPEAKING_STATES]: speakingStateUpdate,
                [globals.STANDARD_ATTRIBUTES.TRAINER]: trainerId,
                [globals.STANDARD_ATTRIBUTES.VIDEO_STATE]: globals.VIDEO_STATES.DISPLAY
            };

            const stringifiedUpdatePayload = utils.stringifyParsedObject(dataUpdate);
            const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdatePayload];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs);
        })
        .then(_ => {
            const linkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.TRAINER, globals.FOREIGN_TYPES.TRAINER, trainerId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.linkRecord, linkQueryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to add trainer to session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function beginSession(sessionId) {
    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.PAUSED]: false,
        [globals.STANDARD_ATTRIBUTES.STATUS]: globals.STATUS.IN_PROGRESS
    };

    const stringifiedUpdatePayload = utils.stringifyParsedObject(dataUpdate);
    const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdatePayload];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs)
        .then(_ => {
            logger.info(`Started session ${sessionId}`);
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to begin session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function createSession(classId, startDateTime) {
    const sessionId = uuid.v4();

    const airtableCreation = {
        [globals.AIRTABLE_ATTRIBUTES.START_DATE_TIME]: startDateTime
    };

    const stringifiedAirtableSessionCreationPayload = utils.stringifyParsedObject(airtableCreation);
    const airtableQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedAirtableSessionCreationPayload];

    return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.createRecord, airtableQueryArgs)
        .then(recordInfo => {
            const airtableId = recordInfo.data.record_id;

            const dataCreation = {
                [globals.STANDARD_ATTRIBUTES.AIRTABLE_ID]: airtableId,
                [globals.STANDARD_ATTRIBUTES.CLASS_ID]: classId,
                [globals.STANDARD_ATTRIBUTES.IS_FULL]: false,
                [globals.STANDARD_ATTRIBUTES.START_DATE_TIME]: startDateTime,
                [globals.STANDARD_ATTRIBUTES.STATUS]: globals.STATUS.NOT_STARTED
            };

            const stringifiedCreationPayload = utils.stringifyParsedObject(dataCreation);
            const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedCreationPayload];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbCreateItem, queryArgs);
        })
        .then(_ => {
            const linkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.CLASS, globals.FOREIGN_TYPES.CLASS, classId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.linkRecord, linkQueryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse(sessionId);
        })
        .catch(err => {
            logger.error(`Failed to create session ${sessionId}:`, { classId, startDateTime }, err);
            return utils.formatErrorResponse(err);
        });
}

function endSession(sessionId) {
    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.STATUS]: globals.STATUS.COMPLETE
    };

    const stringifiedUpdatePayload = utils.stringifyParsedObject(dataUpdate);
    const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdatePayload];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs)
        .then(_ => {
            logger.info(`Ended session ${sessionId}`);
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to pause session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function pauseSession(sessionId) {
    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.PAUSED]: true
    };

    const stringifiedUpdatePayload = utils.stringifyParsedObject(dataUpdate);
    const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdatePayload];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs)
        .then(_ => {
            logger.info(`Paused session ${sessionId}`);
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to pause session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function removeCustomer(sessionId, customerId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingRoomStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.ROOM_STATES] || {};
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};

            const willBeFull = false;
            const signupUpdate = [{ action: globals.SET_OPERATIONS.DELETE, value: customerId }];

            const roomStateUpdate = utils.pruneFalsyObjectEntries({
                ...existingRoomStates,
                [customerId]: null
            });

            const speakingStateUpdate = utils.pruneFalsyObjectEntries({
                ...existingSpeakingStates,
                [customerId]: null
            });

            const cleanedRoomStateUpdate = (Object.keys(roomStateUpdate).length > 0) ? roomStateUpdate : null;
            const cleanedSpeakingStateUpdate = (Object.keys(speakingStateUpdate).length > 0) ? speakingStateUpdate : null;

            const dataUpdate = {
                [globals.STANDARD_ATTRIBUTES.IS_FULL]: willBeFull,
                [globals.STANDARD_ATTRIBUTES.ROOM_STATES]: cleanedRoomStateUpdate,
                [globals.STANDARD_ATTRIBUTES.SIGNUPS]: signupUpdate,
                [globals.STANDARD_ATTRIBUTES.SPEAKING_STATES]: cleanedSpeakingStateUpdate
            };

            const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
            const dataUpdateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, dataUpdateQueryArgs);
        })
        .then(_ => {
            const unlinkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.SIGNUPS, globals.FOREIGN_TYPES.CUSTOMER, customerId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.unlinkRecord, unlinkQueryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to remove customer from session ${sessionId}`, { sessionId, customerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function removeTrainer(sessionId, trainerId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingRoomStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.ROOM_STATES] || {};
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};

            const roomStateUpdate = utils.pruneFalsyObjectEntries({
                ...existingRoomStates,
                [trainerId]: null
            });

            const speakingStateUpdate = utils.pruneFalsyObjectEntries({
                ...existingSpeakingStates,
                [trainerId]: null
            });

            const cleanedRoomStateUpdate = (Object.keys(roomStateUpdate).length > 0) ? roomStateUpdate : null;
            const cleanedSpeakingStateUpdate = (Object.keys(speakingStateUpdate).length > 0) ? speakingStateUpdate : null;

            const dataUpdate = {
                [globals.STANDARD_ATTRIBUTES.PAUSED]: null,
                [globals.STANDARD_ATTRIBUTES.ROOM_STATES]: cleanedRoomStateUpdate,
                [globals.STANDARD_ATTRIBUTES.RUN_TIME]: null,
                [globals.STANDARD_ATTRIBUTES.SPEAKING_STATES]: cleanedSpeakingStateUpdate,
                [globals.STANDARD_ATTRIBUTES.TRAINER]: null,
                [globals.STANDARD_ATTRIBUTES.VIDEO_STATE]: null
            };

            const stringifiedDataUpdate = utils.stringifyParsedObject(dataUpdate);
            const dataUpdateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedDataUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, dataUpdateQueryArgs);
        })
        .then(_ => {
            const unlinkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.TRAINER, globals.FOREIGN_TYPES.TRAINER, trainerId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.unlinkRecord, unlinkQueryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to remove trainer from session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function resumeSession(sessionId) {
    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.PAUSED]: false
    };

    const stringifiedUpdatePayload = utils.stringifyParsedObject(dataUpdate);
    const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdatePayload];

    return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs)
        .then(_ => {
            logger.info(`Resumed session ${sessionId}`);
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to resume session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function updateAllInProgressSessionTimes() {
    const filters = [
        { field: globals.STANDARD_ATTRIBUTES.STATUS, value: globals.STATUS.IN_PROGRESS },
        { field: globals.STANDARD_ATTRIBUTES.PAUSED, value: false }
    ];

    return getAllSessions(filters)
        .then(allSessionsInfo => {
            const parsedSessions = JSON.parse(allSessionsInfo.data.content);

            const timeUpdates = parsedSessions.map(session => {
                const sessionId = session[globals.STANDARD_ATTRIBUTES.SESSION_ID];
                const currentTime = parseInt(session[globals.STANDARD_ATTRIBUTES.RUN_TIME]);

                const newTime = currentTime + 1;
                const markAsCompleted = newTime > globals.MAX_RUN_TIME;
                const status = (markAsCompleted) ? globals.STATUS.COMPLETE : null;

                if (markAsCompleted) {
                    logger.info(`Stale session detected - marking session ${sessionId} as completed`);
                }

                const dataUpdate = {
                    [globals.STANDARD_ATTRIBUTES.RUN_TIME]: newTime,
                    [globals.STANDARD_ATTRIBUTES.STATUS]: status
                };

                const prunedDataUpdate = utils.pruneFalsyObjectEntries(dataUpdate);
                const stringifiedUpdate = utils.stringifyParsedObject(prunedDataUpdate);
                const updateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdate];

                return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, updateQueryArgs);
            });

            return Promise.all(timeUpdates);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to update all in progress sessions`, err);
            return utils.formatErrorResponse(err);
        });
}

function updateAllStaleSessions() {
    return getAllSessions()
        .then(allSessionsInfo => {
            const parsedSessions = JSON.parse(allSessionsInfo.data.content);

            const stateUpdates = parsedSessions.map(session => {
                const sessionId = session[globals.STANDARD_ATTRIBUTES.SESSION_ID];
                const startDateTime = Date.parse(session[globals.STANDARD_ATTRIBUTES.START_DATE_TIME]);
                const currentDateTime = Date.now();

                const lifetime = currentDateTime - startDateTime;
                const isStale = lifetime >= globals.MAX_TIME_TO_LIVE;

                if (!isStale) {
                    return Promise.resolve();
                }

                const dataUpdate = {
                    [globals.STANDARD_ATTRIBUTES.STATUS]: globals.STATUS.COMPLETE
                };

                const stringifiedUpdate = utils.stringifyParsedObject(dataUpdate);
                const updateQueryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdate];

                return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, updateQueryArgs);
            });

            return Promise.all(stateUpdates);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to update all stale sessions`, err);
            return utils.formatErrorResponse(err);
        });
}

function updateCustomerRoomStateOffline(sessionId, customerId) {
    return performLiveStateUpdate(sessionId, customerId, globals.STANDARD_ATTRIBUTES.ROOM_STATES, globals.ROOM_STATES.OFFLINE)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change customer ${customerId} room state to offline for session ${sessionId}`, { sessionId, customerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateCustomerRoomStateOnline(sessionId, customerId, customerAirtableId) {
    const linkQueryArgs = [globals.INTERNAL_TYPE, sessionId, globals.AIRTABLE_ATTRIBUTES.ATTENDEES, globals.FOREIGN_TYPES.CUSTOMER, customerId];

    return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.linkRecord, linkQueryArgs)
        .then(_ => {
            return performLiveStateUpdate(sessionId, customerId, globals.STANDARD_ATTRIBUTES.ROOM_STATES, globals.ROOM_STATES.ONLINE);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change customer ${customerId} room state to online for session ${sessionId}`, { sessionId, customerId, customerAirtableId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateCustomerSpeakingStateNotSpeaking(sessionId, customerId, trainerId) {
    return performLiveStateUpdate(sessionId, customerId, globals.STANDARD_ATTRIBUTES.SPEAKING_STATES, globals.SPEAKING_STATES.NOT_SPEAKING)
        .then(_ => {
            return getSession(sessionId);
        })
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const existingSpeakingStates = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.SPEAKING_STATES] || {};
            const customerSpeakingStates = utils.pruneFalsyObjectEntries({ ...existingSpeakingStates, [trainerId]: null });
            const speakingCustomerStates = Object.keys(customerSpeakingStates).filter(key => customerSpeakingStates[key] === globals.SPEAKING_STATES.SPEAKING);

            if (speakingCustomerStates.length > 0) {
                return Promise.resolve();
            }

            return performLiveStateUpdate(sessionId, trainerId, globals.STANDARD_ATTRIBUTES.SPEAKING_STATES, globals.SPEAKING_STATES.NOT_SPEAKING);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change customer ${customerId} speaking state to not speaking for session ${sessionId}`, { sessionId, customerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateCustomerSpeakingStateSpeaking(sessionId, customerId, trainerId) {
    return performLiveStateUpdate(sessionId, customerId, globals.STANDARD_ATTRIBUTES.SPEAKING_STATES, globals.SPEAKING_STATES.SPEAKING)
        .then(_ => {
            return performLiveStateUpdate(sessionId, trainerId, globals.STANDARD_ATTRIBUTES.SPEAKING_STATES, globals.SPEAKING_STATES.SPEAKING);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change customer ${customerId} speaking state to speaking for session ${sessionId}`, { sessionId, customerId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateStartDateTime(sessionId, startDateTime) {
    const airtableUpdate = {
        [globals.AIRTABLE_ATTRIBUTES.START_DATE_TIME]: startDateTime
    };

    const dataUpdate = {
        [globals.STANDARD_ATTRIBUTES.START_DATE_TIME]: startDateTime
    };

    return performAirtableUpdate(sessionId, airtableUpdate)
        .then(_ => {
            const updatePayload = utils.pruneFalsyObjectEntries(dataUpdate);
            const stringifiedUpdate = utils.stringifyParsedObject(updatePayload);
            const queryArgs = [globals.INTERNAL_TYPE, sessionId, stringifiedUpdate];

            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbUpdateItem, queryArgs)
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.warn(`Failed to add start date and time for session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerRoomStateOffline(sessionId, trainerId) {
    return performLiveStateUpdate(sessionId, trainerId, globals.STANDARD_ATTRIBUTES.ROOM_STATES, globals.ROOM_STATES.OFFLINE)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change trainer ${trainerId} room state to offline for session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerRoomStateOnline(sessionId, trainerId) {
    return performLiveStateUpdate(sessionId, trainerId, globals.STANDARD_ATTRIBUTES.ROOM_STATES, globals.ROOM_STATES.ONLINE)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change trainer ${trainerId} room state to online for session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerSpeakingStateNotSpeaking(sessionId, trainerId) {
    return performLiveTrainerSpeakingStateUpdate(sessionId, globals.SPEAKING_STATES.NOT_SPEAKING)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change trainer ${trainerId} speaking state to not speaking for session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerSpeakingStateSpeaking(sessionId, trainerId) {
    return performLiveTrainerSpeakingStateUpdate(sessionId, globals.SPEAKING_STATES.SPEAKING)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to change trainer ${trainerId} speaking state to speaking for session ${sessionId}`, { sessionId, trainerId }, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerVideoStateHide(sessionId) {
    return performLiveTrainerVideoStateUpdate(sessionId, globals.VIDEO_STATES.HIDE)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to hide trainer video stream for session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function updateTrainerVideoStateShow(sessionId) {
    return performLiveTrainerVideoStateUpdate(sessionId, globals.VIDEO_STATES.DISPLAY)
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to show trainer video stream for session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function wipeAllExpiredSessions() {
    const filters = [
        { field: globals.STANDARD_ATTRIBUTES.STATUS, value: globals.STATUS.COMPLETE }
    ];

    return getAllSessions(filters)
        .then(allSessionsInfo => {
            const parsedSessions = JSON.parse(allSessionsInfo.data.content);
            const affectedSessionIds = parsedSessions.map(session => session[globals.STANDARD_ATTRIBUTES.SESSION_ID]);

            const classUnlinkPromiseChain = utils.createSequentialPromiseChain(parsedSessions.map(session => {
                const sessionId = session[globals.STANDARD_ATTRIBUTES.SESSION_ID];
                const associatedClassId = session[globals.STANDARD_ATTRIBUTES.CLASS_ID];

                const queryArgs = [associatedClassId, sessionId];
                return function () { return utils.issueRequest(endpoints.classService, endpoints.classService.routes.unlinkSession, queryArgs); };
            }));

            return classUnlinkPromiseChain.then(_ => Promise.resolve(affectedSessionIds));
        })
        .then(impactedSessionIds => {
            const sessionWipePromiseChain = utils.createSequentialPromiseChain(impactedSessionIds.map(sessionId => {
                return function () { return wipeSession(sessionId); };
            }));

            return sessionWipePromiseChain;
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to wipe session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

function wipeSession(sessionId) {
    return getSession(sessionId)
        .then(sessionInfo => {
            const parsedSessionInfo = JSON.parse(sessionInfo.data);
            const airtableId = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.AIRTABLE_ID];
            const status = parsedSessionInfo[globals.STANDARD_ATTRIBUTES.STATUS];

            if (status === globals.STATUS.COMPLETE) { // Keep historical record if session was completed
                return Promise.resolve();
            }

            const queryArgs = [globals.INTERNAL_TYPE, airtableId];
            return utils.issueRequest(endpoints.airtableService, endpoints.airtableService.routes.deleteRecord, queryArgs);
        })
        .then(_ => {
            return removeAllCustomersAndTrainer(sessionId);
        })
        .then(_ => {
            const queryArgs = [globals.INTERNAL_TYPE, sessionId];
            return utils.issueRequest(endpoints.awsService, endpoints.awsService.routes.dynamodbDeleteItem, queryArgs);
        })
        .then(_ => {
            return utils.formatSuccessResponse();
        })
        .catch(err => {
            logger.error(`Failed to wipe session ${sessionId}`, err);
            return utils.formatErrorResponse(err);
        });
}

// END MUTATION HANDLERS

module.exports = {
    // BEGIN QUERIES

    getKey,
    getMaxCapacity,
    getSession,
    getSessionAll,

    // END QUERIES

    // BEGIN MUTATIONS

    addCustomer,
    addTrainer,
    beginSession,
    createSession,
    endSession,
    pauseSession,
    removeCustomer,
    removeTrainer,
    resumeSession,
    updateAllInProgressSessionTimes,
    updateAllStaleSessions,
    updateCustomerRoomStateOffline,
    updateCustomerRoomStateOnline,
    updateCustomerSpeakingStateNotSpeaking,
    updateCustomerSpeakingStateSpeaking,
    updateStartDateTime,
    updateTrainerRoomStateOffline,
    updateTrainerRoomStateOnline,
    updateTrainerSpeakingStateNotSpeaking,
    updateTrainerSpeakingStateSpeaking,
    updateTrainerVideoStateHide,
    updateTrainerVideoStateShow,
    wipeAllExpiredSessions,
    wipeSession

    // END MUTATIONS
};
