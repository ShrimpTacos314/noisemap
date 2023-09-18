const bigBox = document.querySelector(`#big-box`);
const container = document.querySelector(`#container`);

let startValue = Math.random() * (Math.PI * 25);

const loadDivs = (container) => {
	let toPush = "";

	for (let i = 0; i < 20; i++) {
		toPush += `<div class="row">`;
		for (let j = 0; j < 20; j++) {
			toPush += `<div class="space" id="X${i}Y${j}"></div>`;
		}
		toPush += `</div>`;
	}

	container.innerHTML = toPush;
};
loadDivs(container);

const getNoiseAtCoordinates = ({ x, y }, offset, config) => {
	return (perlin.get(offset + x / config?.res, offset - y / config?.res) + Number(config?.pos)) * config?.strength;
};

const test = ({ x, y }, offset) => {
	let toReturn = (perlin.get(offset + x / 20, offset - y / 20) + 1) * 180;
	return toReturn;
};

const getNoiseConfig = ({ res, pos, strength }) => {
	return {
		res: document.querySelector(`#${res}`).value,
		pos:
			document.querySelector(`#${pos}`) != undefined
				? document.querySelector(`#${pos}`).value
				: "1",
		strength: document.querySelector(`#${strength}`).value,
	};
};

const fillColors = (offset) => {
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 20; j++) {
			document.querySelector(
				`#X${i}Y${j}`
			).style = `background-color: hsl(${
				getNoiseAtCoordinates(
					{ x: i, y: j },
					offset,
					getNoiseConfig({
						res: "res",
						pos: "hue",
						strength: "strength",
					})
				)
			}, 100%, 50%); top: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					strength: "movement",
				})
			)}em; right: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					strength: "movement",
				})
			)}em`;
		}
	}

	return offset + 0.01;
};

let temp = startValue;

const act = () => {
	temp = fillColors(temp);
	window.requestAnimationFrame(act);
};

window.requestAnimationFrame(act);
// document.addEventListener("wheel", () => {
// 	temp = fillColors(temp);
// })

const fixSize = () => {
	const sideLength = Math.min(window.innerHeight, window.innerWidth);

	bigBox.style = `width: ${sideLength / 1.4}px; height: ${
		sideLength / 1.4
	}px`;
};
fixSize();
window.addEventListener("resize", fixSize);
