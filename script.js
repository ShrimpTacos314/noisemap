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
	let {res, pos, strength} = JSON.parse(config);
	return (perlin.get(offset + x / res, offset - y / res) + pos) * strength;
};

const test = ({ x, y }, offset) => {
	let toReturn = (perlin.get(offset + x / 20, offset - y / 20) + 0.1) * 180;
	return toReturn;
};

const getNoiseConfig = ({ res, pos, strength }) => {
	const toReturn = {
		res: document.querySelector(`#${res}`).value,
		pos: (document.querySelector(`#${pos}`) != undefined ? document.querySelector(`#${pos}`).value : '1'),
		strength: document.querySelector(`#${strength}`).value
	}

	return JSON.stringify(toReturn);
};

const fillColors = (offset) => {
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 20; j++) {
			let space = document.querySelector(`#X${i}Y${j}`);

			space.style = `background-color: hsl(${
				test({x: i, y: j}, offset)
			}, 100%, 50%); top: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					strength: "movement"
				})
			)}em; right: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				getNoiseConfig({
					res: "res",
					pos: "default",
					strength: "movement"
				})
			)}em`;
		}
	}

	return offset + 0.01;
};

let temp = startValue;
// window.setInterval(() => {
// 	temp = fillColors(temp);
// }, 30);
document.addEventListener("wheel", () => {
	temp - fillColors(temp);
})

const fixSize = () => {
	const sideLength = Math.min(window.innerHeight, window.innerWidth);

	bigBox.style = `width: ${sideLength / 1.4}px; height: ${
		sideLength / 1.4
	}px`;
};
fixSize();
window.addEventListener("resize", fixSize);
