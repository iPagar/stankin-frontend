class Connect {
	static post(url, data) {
		return fetch("https://ipagar.ddns.net:8089" + url, {
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...data, sign: window.location.search }),
		})
			.then((response) => {
				if (response.status === 200) return response.json();
				else throw new Error(response.status);
			})

			.then((response) => {
				return {
					data: response,
				};
			});
	}

	static get(url) {
		return fetch("https://ipagar.ddns.net:8089" + url, {
			method: "get",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				if (response.status === 200) return response.json();
				else throw new Error(response.status);
			})

			.then((response) => {
				return response;
			});
	}
}

export default Connect;
