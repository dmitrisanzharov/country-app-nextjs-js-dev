import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";

type Props = {};

const country = (props: Props) => {
	const router = useRouter();
	const queryData = router.query;

	// states
	const [borderCountriesData, setBorderCountriesData] = useState([]);
	const [singleCountryData, setSingleCountryData] = useState([]);
	const [loading, setLoading] = useState(true);

	function getSingleCountryDataFromSession() {
		let singleCountry = JSON.parse(
			sessionStorage.getItem("countries") as any
		).find((el) => el.name.common === router.query.countryName);
		// console.log("singleCountry: ", singleCountry);
		setSingleCountryData(singleCountry);
	}

	function filterAllDataToLeaveOnlyBorderingCountries() {
		let allCountries = JSON.parse(sessionStorage.getItem("countries") as any);
		// console.log("allCountries: ", allCountries);
		// console.log("queryData in useEffect", router.query);

		let finalArr = [];

		console.log("router?.query?.countryBorders", router?.query?.countryBorders);
		console.log("type off", typeof router?.query?.countryBorders);

		if (
			router?.query?.countryBorders.length > 1 &&
			typeof router?.query?.countryBorders === "object"
		) {
			console.log("first");
			router?.query?.countryBorders?.forEach((el) => {
				// console.log(el);
				allCountries?.forEach((el2) => {
					// console.log(el2.cca3);
					if (el2.cca3 === el) {
						finalArr.push(el2);
					}
				});
			});

			// console.log("finalArr", finalArr);
			setBorderCountriesData(finalArr);
		} else if (typeof router?.query?.countryBorders === "string") {
			console.log("second");
			console.log(router?.query?.countryBorders);
			let newArr = allCountries.find(
				(el) => el.cca3 === router?.query?.countryBorders
			);
			console.log(newArr);
			setBorderCountriesData(newArr);
		} else {
			console.log("third");
			setBorderCountriesData([]);
		}

		setLoading(false);
	}

	useEffect(() => {
		if (Object.keys(router.query).length > 0) {
			getSingleCountryDataFromSession();
			filterAllDataToLeaveOnlyBorderingCountries();
		}
	}, [router.query]);

	// useEffect(() => {
	// 	if (!singleCountryData?.currencies) {
	// 		return;
	// 	}

	// 	let currency = Object.keys(singleCountryData?.currencies)[0];
	// 	// console.log("currency: ", currency);

	// 	// console.log(Object.values(singleCountryData?.languages));
	// }, [singleCountryData]);

	if (loading) {
		return <h1>Loading, please wait</h1>;
	}

	return (
		<div>
			<button>
				<Link href={"/"}> {"< "}Back to All countries</Link>
			</button>
			<hr />
			<Image
				src={singleCountryData.flags.svg}
				alt={
					singleCountryData.flags.alt
						? singleCountryData.flags.alt
						: `flag of the country`
				}
				width={100}
				height={100}
			></Image>
			<div style={{ border: "1px solid" }}>
				<p>{singleCountryData.name.common}</p>
				<p>Capital: {singleCountryData.capital[0]}</p>
				<p>Population: {singleCountryData.population}</p>
				{Object.keys(singleCountryData?.currencies)[0] && (
					<p>Currency: {Object.keys(singleCountryData?.currencies)[0]}</p>
				)}
				{Object.values(singleCountryData?.languages) && (
					<p>
						Languages: {Object.values(singleCountryData?.languages).join(", ")}
					</p>
				)}
			</div>
			<h2>Bordering countries</h2>
			<div style={{ display: "flex" }}>
				{borderCountriesData?.length > 0 ? (
					borderCountriesData?.map((el) => {
						const { flags, name, borders } = el;
						const { common } = name;
						const { svg, alt } = flags;

						const queryData = {
							pathname: `/country`,
							query: {
								countryName: common,
								countryBorders: borders,
							},
						};

						return (
							<Link href={queryData} key={common}>
								<div style={{ border: "1px solid", margin: "2px" }}>
									<Image
										src={svg}
										alt={alt ? alt : `flag of a ${common}`}
										width={100}
										height={100}
									></Image>
									<h1>{common}</h1>
									<ul>
										<li>info on country TO ADD</li>
									</ul>
								</div>
							</Link>
						);
					})
				) : (
					<p>country borders nothing</p>
				)}
			</div>
		</div>
	);
};

export default country;
