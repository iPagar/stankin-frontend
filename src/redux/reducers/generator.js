export function updateObject(oldObject, newValues) {
	// Encapsulate the idea of passing a new object as the first parameter
	// to Object.assign to ensure we correctly copy data instead of mutating
	return { ...oldObject, ...newValues };
}

function loadRequest(oldObject) {
	return updateObject(oldObject, {
		isFetching: true,
		didInvalidate: false,
	});
}

function loadSuccess(oldObject, newValues) {
	return updateObject(oldObject, {
		...newValues.response,
		isFetching: false,
		didInvalidate: false,
	});
}

function loadFailure(oldObject) {
	return updateObject(oldObject, {
		isFetching: false,
		didInvalidate: true,
	});
}

export function createReducer(initialState, handlers) {
	return function reducer(state = initialState, action) {
		const expandedHandlers = Object.keys(handlers).reduce(
			(requests, currentRequest) => {
				const regex = new RegExp("LOAD_");

				if (regex.test(currentRequest)) {
					const requestTypes = [
						[currentRequest + "_REQUEST", loadRequest],
						[currentRequest + "_SUCCESS", loadSuccess],
						[currentRequest + "_FAILURE", loadFailure],
					];
					return { ...requests, ...Object.fromEntries(requestTypes) };
				} else {
					const request = [
						[currentRequest, handlers[currentRequest]],
					];
					return {
						...requests,
						...Object.fromEntries(request),
					};
				}
			},
			{}
		);

		if (expandedHandlers.hasOwnProperty(action.type)) {
			return expandedHandlers[action.type](state, action);
		} else {
			return state;
		}
	};
}
