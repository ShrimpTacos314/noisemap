//Get a few essential DOM components.
const bigBox = document.querySelector(`#big-box`);
const container = document.querySelector(`#container`);

//Get the randomized starting value for the perlin noise.
let startValue = Math.random() * (Math.PI * 25);

/**
 * This function takes in a container element (as a DOM element) and places 400 smaller `div` elements in it in a 20 x 20 square. Each of these `div`s will have a unique ID following the format:
 *
 * `X${ x position }Y${ y position }`
 *
 * Each row is a `div` of class `row` containing 20 `div`s. Each of those `div`s has class `space`.
 *
 * @param {*} container  The container DOM element in which to place the `div`s.
 */
const loadDivs = (container) => {
	//To accomplish this function's purpose, we repeatedly add on to a string.
	let toPush = "";

	for (let i = 0; i < 20; i++) {
		toPush += `<div class="row">`;
		for (let j = 0; j < 20; j++) {
			toPush += `<div class="space" id="X${i}Y${j}"></div>`;
		}
		toPush += `</div>`;
	}

	//This string now becomes the inner HTML of the container.
	container.innerHTML = toPush;
};
loadDivs(container);

/**
 * This function actually does all of the heavy lifting in calculating Perlin noise. It takes in some coordinates determined by the offset value given and the X and Y values given, modifies it using the values in `config`, and returns that value.
 *
 * @param {*} pos An object containing X and Y coordinates used in calculating the Perlin noise. These are dereferenced and passed as simple X and Y values.
 * @param {*} offset A number used in calculating "distance", or which section of Perlin noise is sampled.
 * @param {*} config An object containing res (resolution of the perlin noise), pos (the "position" to be added to the calculated noise, or the midpoint of the range of values) and rng (the range of values which the Perlin noise can theoretically extend to)
 * @returns A number corresponding to the perlin noise at coordinates `pos.x` and `pos.y`, with necessary alterations made.
 */
const getNoiseAtCoordinates = ({ x, y }, offset, config) => {
	//We start by getting the X and Y coordinates to pass to the Perlin noise function: offset added to either x or y, divided by config.res.
	//This value is then added to config.pos to change the position, and multiplied by config.rng to change the range.
	return (
		(perlin.get(offset + x / config?.res, offset - y / config?.res) + +config?.pos) * config?.rng
	);
};

/**
 * This function takes in the values of three sliders in the DOM and gets their values. It returns these values as an object that can be passed directly to the `getNoiseAtCoordinates()` function—namely, the returned object contains appropriate values for `res`, `pos`, and `rng`.
 *
 * @param {*} ids An object containing string values corresponding to the IDs of sliders in the menu. `res` creates the value passed to the noise resolution, `pos` creates the value passed to the noise's position, and `rng` creates the value passed to the noise's range.
 * @returns An object that is a valid config object for `getNoiseAtCoordinates()`.
 * @see {@link getNoiseAtCoordinates()}
 */
const getNoiseConfig = ({ res, pos, rng }) => {
	return {
		res: document.querySelector(`#${res}`).value,
		pos:
			document.querySelector(`#${pos}`) != undefined
				? document.querySelector(`#${pos}`).value
				: "1",
		rng: document.querySelector(`#${rng}`).value,
	};
};

/**
 * This function changes the styles of the `div`s created when `loadDivs()` was called. It does so by iterating over all the possible IDs and calling `getNoiseAtCoordinates()` and `getNoiseConfig()` to get the Perlin noise values required.
 *
 * `getNoiseAtCoordinates` is called three times in total: once to determine the hue of the `div` that is currently being acted on, and once each to determine the `right` and `top` values of the current `div`. In all cases, the X and Y values are taken from the for loops used to iterate, and the offset value is taken from `offset`. The values passed to the config object are the result of a `getNoiseConfig()` call, with parameters as follows:
 *
 * - In all cases, the `res` value is taken from the `res` slider.
 * - For the hue calculations, the `pos` value is taken from the `hue` slider. For the position calculations, it is set to 1.
 * - For the hue calculations, the `rng` value is taken from the `rng` slider. For the position calculations, the value is taken from the `mvt` slider.
 *
 * Each `div` is updated in turn. Finally, the function returns a value that is then passed to the `offset` parameter next time it is called.
 *
 * @param {*} offset A number that is used as the offset value for the calculation of the colors and positions of the `div`s.
 * @param {*} speed The number that is added to `offset` to get the return value; this is usually obtained from a slider in the menu.
 * @returns A number corresponding to `offset` added to `speed`; this is stored in a temporary variable and passed back to the function when next it is called.
 * @see getNoiseAtCoordinates         @see getNoiseConfig
 */
const fillColors = (offset, speed) => {
	//Iterate over every div
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 20; j++) {
			//We get the current div using document.querySelector, then update its style.
			//We change its background-color as described above, and its right and top as described above.
			document.querySelector(
				`#X${i}Y${j}`
			).style = `background-color: hsl(${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "hue",
					rng: "rng",
				})
			)}, 100%, 50%); top: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					rng: "mvt",
				})
			)}em; right: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					rng: "mvt",
				})
			)}em`;
		}
	}

	//Return value
	return offset + speed;
};

/**
 * The temporary value that {@link act()} manipulates.
 */
let temp = startValue;

/**
 * This simple function calls `fillColors` with an offset of `temp` and a speed of whatever value the `speed` slider happens to be at currently, updating `temp` to be the result. Then it calls `window.requestAnimationFrame()` on itself, looping indefinitely.
 */
const act = () => {
	temp = fillColors(temp, +document.querySelector("#spd").value);
	window.requestAnimationFrame(act);
};

//Kicks off the indefinite cycle of movement.
window.requestAnimationFrame(act);

/**
 * This function gets the current width and height of the viewport and changes the size of the `big-box`—the container's container—to fit neatly in the center and to stay square. This method is called when the program first runs and when the window is resized.
 */
const fixSize = () => {
	//The length of the side of the square that we want big-box to fill is the smaller of either the viewport height or the viewport width, divided by 1.4.
	const sideLength = Math.min(window.innerHeight, window.innerWidth) / 1.4;

	bigBox.style = `width: ${sideLength}px; height: ${sideLength}px`;
};

//We call fixSize() immediately and whenever the window is resized.
fixSize();
window.addEventListener("resize", fixSize);