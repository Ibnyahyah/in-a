interface Options {
  method: string;
  headers: {};
  body?: string;
}

const sendRequest = async (
  method: string,
  payload: unknown,
  token: string,
  route: string
) => {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const options: Options = {
      method: method,
      headers: headers,
    };
    if (payload) {
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(
      `https://inbox-peak.cyclic.app/${route}`,
      options
    );
    const data = await response.json();
    if (data.message.includes("unauthorized")) {
      throw new Error("unauthorized user");
    }
    return data;
  } catch (error: any) {
    console.log(`${route} error =`, error);
    return error.message;
  }
};

export default sendRequest;
