const express = require("express");
const bodyParser = require("body-parser");
const doLineSegmentsCross = require("do-line-segments-cross");
const dijkstra = require("dijkstrajs");
const find_path = dijkstra.find_path;

// setup consts for the server:
const kMyPort = 4000;
const kMyRoute = "/fsp";

const app = express();
// signal the server to parse requests as json:
app.use(bodyParser.json());
// allow CORS requests:
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X_Requested-With, Content-Type, Accept"
	);
	next();
});

// listen for POST calls on the find-shortest-path route:
app.post(kMyRoute, (req, res) => {
	// make sure that the request if valid:
	if (!validateRequest(req.body)) {
		console.log(
			"The received request is not valid, please double-check it"
		);
		res.status(400).end();
	} else {
		console.log("\nReceived a valid request:");
		console.log(JSON.stringify(req.body));

		// transform the map into an undirected graph with distances as weights:
		myGraph = transformMapToGraph(req.body);

		// use dijkstrajs to calculate the shortest-path from source-point to destination-point:
		var sPath = find_path(
			myGraph,
			calcKeyFromPoint(req.body.sourcePoint),
			calcKeyFromPoint(req.body.destinationPoint)
		);

		// convert the result (array of keys) to an array of points (the output path):
		var myResult = sPath.map(item => {
			var mySplit = item.split(",");
			return {
				x: parseFloat(mySplit[0]),
				y: parseFloat(mySplit[1])
			};
		});

		console.log("\nCalculated shortest path:");
		console.log(JSON.stringify(myResult));

		// return to the client:
		res.json(myResult);
	}
});

// start the http service on port 4000:
app.listen(kMyPort, () =>
	console.log(`Listening for http requests on port ${kMyPort}...`)
);

// the main method that transforms the map into a graph:
const transformMapToGraph = dataSet => {
	var retGraph = {};

	var listOfIcebergs = dataSet.icebergs != null ? dataSet.icebergs : [];

	// add all vertices as nodes:
	for (const iceberg of listOfIcebergs) {
		for (var z = 0; z < iceberg.points.length; z++) {
			const vertex = iceberg.points[z];
			var locKey = calcKeyFromPoint(vertex);
			retGraph[locKey] = {};
		}
	}
	// add also the source-point and the destination-point as nodes:
	var keySource = calcKeyFromPoint(dataSet.sourcePoint);
	retGraph[keySource] = {};
	var keyDestination = calcKeyFromPoint(dataSet.destinationPoint);
	retGraph[keyDestination] = {};

	// add edges between all vertices that have a line-of-sight:
	for (const ice of listOfIcebergs) {
		for (var z = 0; z < ice.points.length; z++) {
			const vtx = ice.points[z];
			addEdgesToAdjacentVertices(ice.points, z, retGraph);
			for (const otherIceberg of listOfIcebergs) {
				if (otherIceberg !== ice) {
					for (var iv = 0; iv < otherIceberg.points.length; iv++) {
						const otherVertex = otherIceberg.points[iv];
						if (
							!doesCrossAnyEdge(vtx, otherVertex, listOfIcebergs)
						) {
							addEdge(vtx, otherVertex, retGraph);
						}
					}
				}
			}
		}
	}

	// process the source-point and the destination-point
	var straightLineIsPossible = false;
	if (
		!doesCrossAnyEdge(
			dataSet.sourcePoint,
			dataSet.destinationPoint,
			listOfIcebergs
		)
	) {
		addEdge(dataSet.sourcePoint, dataSet.destinationPoint, retGraph);
		straightLineIsPossible = true;
	}
	if (!straightLineIsPossible) {
		// continue here only if a straight line between the source and the destination is NOT possible!
		// if it IS possible then it will be the SPF (and there's no need to connect the source or the destination to any other vertex...)
		for (const myIce of listOfIcebergs) {
			for (const myPoint of myIce.points) {
				// go through all of the vertices in all icebergs in the map:
				if (
					!doesCrossAnyEdge(
						dataSet.sourcePoint,
						myPoint,
						listOfIcebergs
					)
				) {
					addEdge(dataSet.sourcePoint, myPoint, retGraph);
				}
				if (
					!doesCrossAnyEdge(
						dataSet.destinationPoint,
						myPoint,
						listOfIcebergs
					)
				) {
					addEdge(dataSet.destinationPoint, myPoint, retGraph);
				}
			}
		}
	}
	return retGraph;
};

// determines if the line between the given points crosses any existing iceberg edge in the map:
const doesCrossAnyEdge = (pt1, pt2, icebergList) => {
	var retVal = false;
	for (const iceberg of icebergList) {
		for (var v = 0; v < iceberg.points.length && !retVal; v++) {
			var vtx1 = iceberg.points[v];
			var vtx2 =
				v === iceberg.points.length - 1
					? iceberg.points[0]
					: iceberg.points[v + 1];
			if (
				!isSamePoint(pt1, vtx1) &&
				!isSamePoint(pt1, vtx2) &&
				!isSamePoint(pt2, vtx1) &&
				!isSamePoint(pt2, vtx2)
			) {
				retVal = doLineSegmentsCross(pt1, pt2, vtx1, vtx2);
			}
		}
		if (retVal) {
			break;
		}
	}
	return retVal;
};

// add edges from a vertex to its neighbours (in the same iceberg):
const addEdgesToAdjacentVertices = (arrOfPoints, idxOfPoint, graph) => {
	var myPoint = arrOfPoints[idxOfPoint];

	// point to the "left":
	var idxLeft = idxOfPoint === 0 ? arrOfPoints.length - 1 : idxOfPoint - 1;
	var leftPoint = arrOfPoints[idxLeft];
	addEdge(myPoint, leftPoint, graph);

	// point to the "right":
	var idxRight = idxOfPoint === arrOfPoints.length - 1 ? 0 : idxOfPoint + 1;
	var rightPoint = arrOfPoints[idxRight];
	addEdge(myPoint, rightPoint, graph);
};

// add an edge to the graph between the given points - with the distance between them as the weight:
const addEdge = (pt1, pt2, graph) => {
	var keyPt1 = calcKeyFromPoint(pt1);
	var keyPt2 = calcKeyFromPoint(pt2);
	var myDistance = calcDistance(pt1, pt2);
	if (graph[keyPt1][keyPt2] == null) {
		graph[keyPt1][keyPt2] = myDistance;
	}
	if (graph[keyPt2][keyPt1] == null) {
		graph[keyPt2][keyPt1] = myDistance;
	}
};

// determine if two points are the same:
const isSamePoint = (pt1, pt2) => {
	return pt1.x === pt2.x && pt1.y === pt2.y;
};

// calculates the key for a given point:
const calcKeyFromPoint = myPoint => {
	return `${myPoint.x},${myPoint.y}`;
};

// calculates the distance between two points:
const calcDistance = (pt1, pt2) => {
	var deltaX = Math.abs(pt1.x - pt2.x);
	var deltaY = Math.abs(pt1.y - pt2.y);
	return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
};

// make sure that a request is properly formed:
const validateRequest = dataSet => {
	var retVal = true;
	if (dataSet.icebergs != null) {
		if (!Array.isArray(dataSet.icebergs)) {
			retVal = false;
		}
		if (retVal) {
			// make sure that all icebergs have points (at least three for each iceberg):
			retVal = dataSet.icebergs.reduce((prevVal, ice) => {
				var curIceHasPointsOK =
					ice.points != null &&
					Array.isArray(ice.points) &&
					ice.points.length >= 3;
				var innerRetOk = prevVal && curIceHasPointsOK;
				if (innerRetOk) {
					// make sure that all points have a numeric x and y properties with a value:
					var allPointsHaveXandY = ice.points.reduce(
						(prevCalcVal, pnt) => {
							return prevCalcVal && validatePoint(pnt);
						},
						true
					);
					innerRetOk = allPointsHaveXandY;
				}
				return innerRetOk;
			}, true);
		}
	}
	if (retVal) {
		// make sure that source and destination points exist and are valid:
		retVal =
			dataSet.sourcePoint != null && dataSet.destinationPoint != null;
		if (retVal) {
			retVal =
				validatePoint(dataSet.sourcePoint) &&
				validatePoint(dataSet.destinationPoint);
		}
	}
	return retVal;
};

// validate a point object:
const validatePoint = myPoint => {
	return (
		myPoint.x != null &&
		typeof myPoint.x === "number" &&
		myPoint.y != null &&
		typeof myPoint.y === "number"
	);
};
