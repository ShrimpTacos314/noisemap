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

const getNoiseAtCoordinates = ({ x, y }, offset, strength) => {
	return (perlin.get(offset + x / 20, offset - y / 20) + 1) * strength;
};

const fillColors = (offset) => {
	for (let i = 0; i < 20; i++) {
		for (let j = 0; j < 20; j++) {
			let space = document.querySelector(`#X${i}Y${j}`);

			space.style = `background-color: hsl(${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				180
			)}, 100%, 50%); top: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				35
			)}px; right: ${getNoiseAtCoordinates(
				{ x: i, y: j },
				offset,
				35
			)}px`;
		}
	}

	return offset + 0.01;
};

let temp = startValue;
window.setInterval(() => {
	temp = fillColors(temp);
}, 30);

const fixSize = () => {
	const sideLength = Math.min(window.innerHeight, window.innerWidth);

	bigBox.style = `width: ${sideLength / 1.4}px; height: ${
		sideLength / 1.4
	}px`;
};
fixSize();
window.addEventListener("resize", fixSize);
