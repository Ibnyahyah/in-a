const config = async (email: string, password: string) => {
  const payload = { email, password };
  try {
    const response = await fetch(`https://inbox-peak.cyclic.app/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("login error", error);
  }
};

export default config;
