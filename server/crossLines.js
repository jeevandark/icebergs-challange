// calc the orientation of an ordered triplet (p, q, r)
// returns:
// 0 -> p, q and r are colinear
// 1 -> Clockwise
// 2 -> Counterclockwise
const orientation = (p, q, r) => {
	var retVal;
	var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if (val == 0) {
		retVal = 0; // colinear
	} else {
		retVal = val > 0 ? 1 : 2; // clock-wise : counterclock-wise
	}
	return retVal;
};

// checks if point q lies on line segment 'pr' - for the colinear case:
const onSegment = (p, q, r) => {
	var retVal = false;
	if (
		q.x <= Math.max(p.x, r.x) &&
		q.x >= Math.min(p.x, r.x) &&
		q.y <= Math.max(p.y, r.y) &&
		q.y >= Math.min(p.y, r.y)
	) {
		retVal = true;
	}
	return false;
};

// the main function - returns true if line segment p1-q1 and p2-q2 intersect:
const doLinesIntersect = (p1, q1, p2, q2) => {
	var retVal = false;

	// Find the four orientations needed for general and special cases:
	var o1 = orientation(p1, q1, p2);
	var o2 = orientation(p1, q1, q2);
	var o3 = orientation(p2, q2, p1);
	var o4 = orientation(p2, q2, q1);

	// General case
	if (o1 != o2 && o3 != o4) {
		retVal = true;
	}

	// Special Cases
	// p1, q1 and p2 are colinear and p2 is on segment p1-q1:
	if (o1 == 0 && onSegment(p1, p2, q1)) {
		retVal = true;
	}

	// p1, q1 and q2 are colinear and q2 is on segment p1-q1:
	if (o2 == 0 && onSegment(p1, q2, q1)) {
		retVal = true;
	}

	// p2, q2 and p1 are colinear and p1 is on segment p2-q2:
	if (o3 == 0 && onSegment(p2, p1, q2)) {
		retVal = true;
	}

	// p2, q2 and q1 are colinear and q1 is on segment p2-q2:
	if (o4 == 0 && onSegment(p2, q1, q2)) {
		retVal = true;
	}

	return retVal;
};

module.exports = {
	doLinesIntersect: doLinesIntersect
};
