function toInt(x) {
	if (isNaN(parseInt(x))) return 0;
	return parseInt(x);
}

function sum(arr) {
	let ret = 0;
	for (let v of arr) ret += v;
	return ret;
}

function format_percent(num) {
	return `<span title="${num.toFixed(4)}%">${num.toFixed(2)}%</span>`;
}

const table = document.querySelector('.playlog_notes_detail');
if (!table) {
	throw new Error("Could not find score details table");
}

for (let i = 1; i <= 5; i++) {
	table.rows[i].cells[0].classList.remove("f_0");
}
const grid = Array.from(table.rows, r => r.innerText.split('\t').map(toInt));

function append(r, c, v) {
	const p = document.createElement("p");
	p.innerHTML = v;
	p.classList.add("maimai-detail-text");
	table.rows[r].cells[c].appendChild(p);
}

const total = sum(grid[1]) + 2*sum(grid[2]) + 3*sum(grid[3]) + sum(grid[4]) + 5*sum(grid[5]);
const base = 100/total;

let losses = Array.from(Array(6), () => Array(6).fill(0));
for (let r = 1; r <= 4; r++) {
	const factor = r == 4 ? 1 : r;
	losses[r][3] = factor*grid[r][3]*base/5;
	losses[r][4] = factor*grid[r][4]*base/2;
	losses[r][5] = factor*grid[r][5]*base;
}
const break_row = grid[5];
const num_breaks = sum(break_row);
losses[5][4] = grid[5][4]*(3*base + .7/num_breaks);
losses[5][5] = grid[5][5]*(5*base + 1/num_breaks);
const loss = sum(losses.map(sum));

for (let r = 1; r <= 5; r++) {
	for (let c = 3; c <= 5; c++) {
		const v = losses[r][c];
		if (v > 0) append(r, c, `(${format_percent(-v)})`);
	}
}

const p = parseFloat(document.querySelector('.playlog_achievement_txt').innerText);
const min_ploss = .25/num_breaks*break_row[2];
const min_gloss = (5*base/5+.6/num_breaks)*break_row[3];
const max_ploss = .5/num_breaks*break_row[2];
const max_gloss = (5*base/2+.6/num_breaks)*break_row[3];
const rem = 101 - loss - p;

if (break_row[2] > 0) {
	append(5, 2, (() => {
		const mi = -Math.max(min_ploss, rem - max_gloss);
		const ma = -Math.min(max_ploss, rem - min_gloss);
		if (Math.abs(ma - mi) < 1e-4) {
			return ` (${format_percent(mi)})`;
		}
		return ` (${format_percent(mi)}~ ${format_percent(ma)})`;
	})());
}

if (break_row[3] > 0) {
	append(5, 3, (() => {
		const mi = -Math.max(min_gloss, rem - max_ploss);
		const ma = -Math.min(max_gloss, rem - min_ploss);
		if (Math.abs(ma - mi) < 1e-4) {
			return ` (${format_percent(mi)})`;
		}
		return ` (${format_percent(mi)}~ ${format_percent(ma)})`;
	})());
}

for (let r = 1; r <= 4; r++) {
	const factor = r == 4 ? 1 : r;
	const total = sum(grid[r])*factor*base;
	if (total == 0) continue;
	append(r, 0, `-${format_percent(sum(losses[r]))}/${format_percent(total)}`);
}
const break_total = sum(grid[5])*5*base;
append(5, 0, `-${format_percent(sum(losses[5])+rem)}/${format_percent(break_total)}`);