import "./home.css";
import React, { useRef, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Offline, Online, Detector } from "react-detect-offline";
import Loader from "../Loader";

const imageSets = [
	{
		name: "twitter",
		description: "Basketball 1",
		premium: false,
	},
	{ 
		name: "facebook", 
		description: "Basketball 2", 
		premium: true },
	{
		name: "google",
		description: "Basketball 3",
		premium: true,
	},
	{
		name: "apple",
		description: "Basketball 4",
		premium: true,
	},
];

const Home = ({ setIsRegistered }) => {
	const pickerRef = useRef(null);
	const [activeSet, setActiveSet] = useState(imageSets[0]);
	const [isLicensed, setIsLicensed] = useState(false);
	const [cookie, , removeCookie] = useCookies(["ex_lic", "ex_set_name"]);
	const [deauthorizedClicked, setDeauthorizedClicked] = useState(false);

	useEffect(() => {
		// check if cookie is null
		if (JSON.stringify(cookie) === "{}") {
			return setIsRegistered(false);
		}

		setIsLicensed(cookie.ex_lic.licensed);

		// creating picker element
		const storedSet = JSON.parse(localStorage.getItem("set")) || imageSets[0];

		setActiveSet(storedSet);

	}, []);

	const downloadImage = async () => {
		const imageUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-${activeSet.name}@14.0.0/img/${activeSet.name}/64/1f3c0.png`;

		const a = document.createElement("a");
		a.href = await download(imageUrl);
		a.download = "https://cdn.jsdelivr.net/npm/emoji-datasource-${activeSet.name}@14.0.0/img/${activeSet.name}/64/1f3c0.png";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const download = (source) => {
		return fetch(source)
			.then((response) => {
				return response.blob();
			})
			.then((blob) => {
				return URL.createObjectURL(blob);
			});
	};

	const handleDeauthorize = () => {
		if (!isLicensed) {
			setIsRegistered(false);
			removeCookie("ex_lic");
			localStorage.removeItem("set");
		}
		setDeauthorizedClicked(true);
	};

	const handleRemoveKey = () => {
		removeCookie("ex_lic");
		localStorage.removeItem("set");
		setIsRegistered(false);
	};

	const handleSetChange = (currSet) => {
		if (!navigator.onLine) return;
		if (!isLicensed && currSet.premium) return;

		localStorage.setItem("set", JSON.stringify(currSet));
		setActiveSet(currSet);
		window.location.reload();
	};

	function capitalize(string) {
		return string.replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	}

	return (
		<>
			<div className="header">
				<p>Image Extension {!isLicensed && "- Trial Mode"}</p>
			</div>
			<div className="container">
				<h2 className="app_title">
					<Online>Download {capitalize(activeSet.description)}</Online>
					<Offline>No internet connection...</Offline>
				</h2>
				<Detector
					render={({ online }) => (
						<div
							style={{ position: "relative", width: "fit-content" }}
							className={online ? "is-online" : "is-offline"}
						>
							<div style={{ opacity: online ? "1" : "0.3" }} ref={pickerRef} />
							{!online && <Loader />}
						</div>
					)}
				/>

				<div>
					<Online>
						

						<button onClick={downloadImage} className="download-image-btn">
							Send
							<img
								src={`https://cdn.jsdelivr.net/npm/emoji-datasource-${activeSet.name}@14.0.0/img/${activeSet.name}/64/1f3c0.png`}
								alt="..."
								style={{ width: "20px", height: "20px" }}
							/>
							to composition
						</button>
					</Online>
					<Offline>
						<div style={{ width: "fit-content" }}>
							<p className="offline_description">
								To access Images's please connect to the internet
							</p>
						</div>
					</Offline>
				</div>

				<div className="option_container">

					<p className="sub_headings">Save path:</p>
					<input directory="project/folder/path" webkitdirectory="project/folder/path" type="folder" />

					<p className="sub_headings">Options:</p>
					<div>
						{imageSets.map((set) => (
							<div
								className={`set_btn ${
									activeSet.name === set.name ? "active_set_btn" : ""
								}`}
								onClick={() => handleSetChange(set)}
								key={set.name}
							>
								<p>
									{capitalize(set.description)} {!isLicensed && set.premium && "🔒"}
								</p>
								<p className="info">
									<Online>
										<img
											src={`https://cdn.jsdelivr.net/npm/emoji-datasource-${set.name}@14.0.0/img/${set.name}/64/1f3c0.png`}
											alt="..."
											style={{ width: "20px", height: "20px" }}
										/>
									</Online>
									<Offline>internet connection required</Offline>
								</p>
							</div>
						))}
					</div>

					<p className="sub_headings">System</p>
					<div>
						{!deauthorizedClicked ? (
							<div
								className="download-image-btn system_btn"
								onClick={handleDeauthorize}
							>
								{!isLicensed ? "Authorize" : "Deauthorize"} Computer
							</div>
						) : (
							<div className="system_deauthorize_btns">
								<button onClick={handleRemoveKey} className="remove_key_btn">
									Remove Key
								</button>
								<button onClick={() => setDeauthorizedClicked(false)}>
									Cancel
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="extension_description">
					<p>Image Extension - 1.0</p>
					<p>&copy; 2022 James Milton</p>
				</div>
			</div>
		</>
	);
};

export default Home;
