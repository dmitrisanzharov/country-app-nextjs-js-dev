import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/pages/index.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

// routes
import { countryApi } from "../utils/api_routes";

export default function Home() {
	// states
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	// styles
	const { countryCard } = styles;

	useEffect(() => {
		axios
			.get(countryApi)
			.then((el) => {
				console.log(el.data);
				sessionStorage.setItem("countries", JSON.stringify(el.data));
				setData(el.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
			});
	}, []);

	useEffect(() => {
		let test = data.map((el) => el.borders);
		console.log("test: ", test);
	}, [data]);

	if (error) {
		return (
			<h1>
				There was an error, please reload or try again... if problem persists
				please contact company tech support
			</h1>
		);
	}

	if (loading) {
		return <h1>Loading please wait...</h1>;
	}

	return (
		<div>
			<Head>
				<title>Country App by Victor Sarov</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Countries App</h1>
			{/* <Link href={"/foo"}>go to Foo page</Link> */}
			{data?.map((el) => {
				const { name, population, flags, capital, borders } = el;
				const { common } = name;
				const { alt, svg } = flags;

				const queryData = {
					pathname: `/country`,
					query: {
						countryName: common,
						countryBorders: borders,
					},
				};

				// console.log(capital);

				return (
					<div key={common} style={{ width: "50vw" }}>
						<Link href={queryData}>
							<fieldset>
								<legend>Country</legend>
								<div>
									{/* Flag and Details */}
									<div>
										<Image
											src={svg}
											alt={alt ? alt : `flag of a ${common}`}
											width={100}
											height={100}
										></Image>
										{/* details */}
										<div>
											<h3>Country Name: {common}</h3>
											{capital ? <div>{capital[0]}</div> : null}
										</div>
									</div>
									{/* population */}
									<div>
										Population:{" "}
										{
											(population as number)
												.toFixed(1)
												.replace(/\d(?=(\d{3})+\.)/g, "$&,")
												.split(".")[0]
										}
									</div>
								</div>
							</fieldset>
						</Link>
					</div>
				);
			})}
		</div>
	);
}
