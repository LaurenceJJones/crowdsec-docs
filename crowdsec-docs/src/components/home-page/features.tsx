import React from "react";

const FEATURES_LIST = [
	{
		//screenshot terminal / apt-get ?
		title: "Easy to Setup and Use",
		Svg: require("../../static/img/icon-easytouse.svg").default,
		link: "/docs/getting_started/install_crowdsec",
		description: (
			<>
				CrowdSec is easy to install, deploy and use regardless of your knowledge. You don't need to be a security master to enjoy
				its full capabilities.
			</>
		),
	},
	{
		//screenshot metabase ?
		title: "Replayable",
		Svg: require("../../static/img/icon-replay.svg").default,
		link: "/u/user_guides/replay_mode",
		description: <>CrowdSec is able to process both live and old logs, which makes it false-positive resilient.</>,
	},
	{
		//screenshot de grafana
		title: "Observable",
		link: "/docs/observability/prometheus#exploitation-with-prometheus-server--grafana",
		Svg: require("../../static/img/icon-data.svg").default,
		description: (
			<>
				CrowdSec is instrumented with Metabase & Prometheus to generate out-of-the-box dashboards and monitor activity across your
				assets.
			</>
		),
	},
	{
		//schema api ?
		title: "API-Driven",
		Svg: require("../../static/img/icon-api.svg").default,
		link: "/docs/local_api/intro",
		description: <>All components communicate via HTTP API, making it easy to cover complex setups.</>,
	},
	{
		//schema api ?
		title: "Participative",
		link: "/docs/central_api/intro",
		Svg: require("../../static/img/icon-collaborative.svg").default,
		description: <>You can share malevolent IP data with your fellow users, have each other's backs and outnumber hackers.</>,
	},
	{
		//schema api ?
		title: "Open Source",
		Svg: require("../../static/img/icon-opensource.svg").default,
		link: "/docs/faq#what-licence-is-crowdsec-released-under-",
		description: <>CrowdSec is as open source and free as it can be through an MIT license. No back doors. No shenanigans.</>,
	},
	//community driven ->
	//open-source
	//detect here apply there
	//block anything, not just ips
];

const Feature = ({ Svg, title, description, link }): React.JSX.Element => {
	return (
		<div className="col col-4">
			<div className="text-center">
				<a href={link}>
					{" "}
					<Svg className="h-52 w-52" alt={title} style={{ width: "27.5%" }} />
				</a>
			</div>
			<div className="text-center padding-horiz--md">
				<h3>{title}</h3>
				<p style={{ textAlign: "justify" }}>{description}</p>
			</div>
		</div>
	);
};

const HomepageFeatures = () => (
	<section className="flex items-center py-8 w-full bg-primary text-foreground">
		<div className="container">
			<div className="row">
				{FEATURES_LIST.map((props) => (
					<Feature key={props.title} {...props} />
				))}
			</div>
		</div>
	</section>
);

export default HomepageFeatures;
