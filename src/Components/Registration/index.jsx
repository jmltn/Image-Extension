import React, { useEffect } from "react";
import "./Registration.css";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Registration = ({ setIsRegistered }) => {
	const [licenseInputVal, setLicenseInputVal] = useState("");
	const tokens = ["Test1", "Test2", "Test3"];
	const [cookie, setCookie] = useCookies(["ex_lic"]);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		// check if cookie contains key
		if (!cookie.hasOwnProperty("ex_lic")) {
			return;
		}

		if (cookie.ex_lic.loggedIn) {
			return setIsRegistered(true);
		}
		// eslint-disable-next-line
	}, []);

	const setLicenseInput = (e) => {
		setLicenseInputVal(e.target.value);
	};

	const handleRegister = () => {
		if (tokens.includes(licenseInputVal)) {
			setCookie("ex_lic", {
				userType: "trail",
				licensed: true,
				key: licenseInputVal,
				loggedIn: true,
			});
			setIsRegistered(true);
		} else {
			setErrorMessage("Invalid license key 😢");
			setTimeout(() => {
				setErrorMessage("");
			}, 3000);
		}
	};

	const handleTrial = (e) => {
		e.preventDefault();
		setCookie("ex_lic", { userType: "trail", licensed: false, loggedIn: true });
		setIsRegistered(true);
	};

	return (
		<>
			<div className="header">
				<p>Image Extension - Registration</p>
			</div>
			<div className="container">
				<div className="containerBody">
					<p className="registrationInfo">
						Image Extension has not been registered
					</p>
					<p className="versionInfo">Version: 1.0</p>
					<p className="statusInfo">
						You are currently running Image Extensions in trial mode. which
						gives you only the Twitter Image set.
					</p>
					<div>
						<a href="/">
							<button className="button">Buy at Gumroad.com</button>
						</a>
						<a href="/">
							<button className="button">Buy at AEScripts.com</button>
						</a>
					</div>
					<p className="registerMessage">
						To register and unlock the full version, please enter your serial
						number in the box below:
					</p>
					<div className="register">
						<input
							type="text"
							className="textBox"
							value={licenseInputVal}
							onChange={setLicenseInput}
						/>
						<button className="registerBtn button" onClick={handleRegister}>
							Register
						</button>
					</div>
					{errorMessage && <p style={{ color: "#b23d3d" }}>{errorMessage}</p>}
					<div className="trialMessage">
						or{" "}
						<a href="/" onClick={handleTrial}>
							continue with trial
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default Registration;
