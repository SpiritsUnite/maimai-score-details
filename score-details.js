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
table.style.width = "100%";

for (let i = 1; i <= 5; i++) {
	table.rows[i].cells[0].classList.remove("f_0");
}
const grid = Array.from(table.rows, r => r.innerText.split('\t').map(toInt));

function append(r, c, v) {
	// Safe because v is either hard-coded text or from format_percent() which
	// only works on numbers.
	table.rows[r].cells[c].innerHTML += v;
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
		if (v > 0) append(r, c, `<br>(${format_percent(-v)})`);
	}
}

const p = parseFloat(document.querySelector('.playlog_achievement_txt').innerText);
const rem = 101 - loss - p;

for (let r = 1; r <= 5; r++) {
	const factor = r == 4 ? 1 : r;
	let total = sum(grid[r])*factor*base;
	let v = sum(losses[r]);
	if (r == 5) {
		v += rem;
		total += 1;
	}
	if (total == 0) continue;
	append(r, 0, `<br>-${format_percent(v)} (${format_percent(total)})`);
}

// Try all combinations of breaks to figure out breakdown.
let closest = null;
let closest_break = null;
let next_closest = null;
// Sometimes all solutions have the same perfect breakdown, but different great
// breakdowns, so this tracks the closest solution that has a different perfect
// breakdown.
let next_perfect = null;
for (let gp = 0; gp <= break_row[2]; gp++) {
for (let gg = 0; gg <= break_row[3]; gg++) {
for (let mg = 0; mg <= break_row[3] - gg; mg++) {
	let bp = break_row[2] - gp;
	let bg = break_row[3] - gg - mg;
	let bloss = (gp/4 + bp/2)/num_breaks +
				(5*base/5+.6/num_breaks)*gg +
				(5*base*.4+.6/num_breaks)*mg +
				(5*base/2+.6/num_breaks)*bg;
	if (closest === null || Math.abs(bloss - rem) < closest) {
		if (closest != null && closest_break[0] != gp) {
			next_perfect = closest;
		}
		next_closest = closest;
		closest = Math.abs(bloss - rem);
		closest_break = [gp, bp, gg, mg, bg];
	} else {
		if (next_closest === null || Math.abs(bloss - rem) < next_closest) {
			next_closest = Math.abs(bloss - rem);
		}
		if (closest_break[0] != gp &&
				(next_perfect === null || Math.abs(bloss - rem) < next_perfect)) {
			next_perfect = Math.abs(bloss - rem);
		}
	}
}
}
}

if (next_perfect === null || next_perfect > 0.00015) {
	const [gp, bp, gg, mg, bg] = closest_break;
	const ploss = -(gp/4 + bp/2)/num_breaks;
	if (break_row[2] > 0) {
		append(5, 2, `&nbsp;(${gp},${bp})<br>(${format_percent(ploss)})`);
	}
	if (break_row[3] > 0) {
		if (next_closest === null || next_closest > 0.00015) {
			append(5, 3, `&nbsp;(${gg},${mg},${bg})<br>(${format_percent(-rem - ploss)})`);
		} else {
			append(5, 3, `<br>(${format_percent(-rem - ploss)})`);
		}
	}
} else {
	const min_ploss = .25/num_breaks*break_row[2];
	const min_gloss = (5*base/5+.6/num_breaks)*break_row[3];
	const max_ploss = .5/num_breaks*break_row[2];
	const max_gloss = (5*base/2+.6/num_breaks)*break_row[3];

	if (break_row[2] > 0) {
		append(5, 2, (() => {
			const mi = -Math.max(min_ploss, rem - max_gloss);
			const ma = -Math.min(max_ploss, rem - min_gloss);
			if (Math.abs(ma - mi) < 1e-4) {
				return `<br>(${format_percent(mi)})`;
			}
			return `<br>(${format_percent(mi)}~<br>${format_percent(ma)})`;
		})());
	}

	if (break_row[3] > 0) {
		append(5, 3, (() => {
			const mi = -Math.max(min_gloss, rem - max_ploss);
			const ma = -Math.min(max_gloss, rem - min_ploss);
			if (Math.abs(ma - mi) < 1e-4) {
				return `<br>(${format_percent(mi)})`;
			}
			return `<br>(${format_percent(mi)}~<br>${format_percent(ma)})`;
		})());
	}
}