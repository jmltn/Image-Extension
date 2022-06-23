import React, { useState } from "react";
import Home from "./Components/Home";
import Registration from "./Components/Registration";
import { CookiesProvider } from "react-cookie";

const App = () => {
	const [isRegistered, setIsRegistered] = useState(false);

	return (
		<CookiesProvider>
			{!isRegistered ? (
				<Registration setIsRegistered={setIsRegistered} />
			) : (
				<Home setIsRegistered={setIsRegistered} />
			)}
		</CookiesProvider>
	);
};

export default App;
