function toInt(x) {
	if (isNaN(parseInt(x))) return 0;
	return parseInt(x);
}

function sum(arr) {
	let ret = 0;
	for (let v of arr) ret += v;
	return ret;
}

const table = document.querySelector('.playlog_notes_detail');
if (!table) {
	throw new Error("Could not find score details table");
}
const rows = x => table.rows[x].innerText.split('\t').map(toInt);
const total = sum(rows(1)) + 2*sum(rows(2)) + 3*sum(rows(3)) + sum(rows(4)) + 5*sum(rows(5));

const base = 100/total;
let loss = 0;

function append(r, c, f) {
	let v = toInt(table.rows[r].cells[c].innerText);
	if (!v) return;
	table.rows[r].cells[c].innerText += f(v);
}

const modify = (r, c, f) => append(r, c, v => {
	let num = f(v);
	loss += num;
	return ` (${(-num).toFixed(4)}%)`;
});
let break_row = rows(5);
let num_breaks = sum(break_row);

modify(1, 3, v => base/5*v);
modify(1, 4, v => base/2*v);
modify(1, 5, v => base*v);
modify(2, 3, v => 2*base/5*v);
modify(2, 4, v => 2*base/2*v);
modify(2, 5, v => 2*base*v);
modify(3, 3, v => 3*base/5*v);
modify(3, 4, v => 3*base/2*v);
modify(3, 5, v => 3*base*v);
modify(4, 3, v => base/5*v);
modify(4, 4, v => base/2*v);
modify(4, 5, v => base*v);
modify(5, 4, v => (5*base*3/5+.7/num_breaks)*v);
modify(5, 5, v => (5*base + 1/num_breaks)*v);

const p = parseFloat(document.querySelector('.playlog_achievement_txt').innerText);
const min_ploss = .25/num_breaks*break_row[2];
const min_gloss = (5*base/5+.6/num_breaks)*break_row[3];
const max_ploss = .5/num_breaks*break_row[2];
const max_gloss = (5*base/2+.6/num_breaks)*break_row[3];
const rem = 101 - loss - p;

append(5, 2, () => {
	const mi = -Math.max(min_ploss, rem - max_gloss);
	const ma = -Math.min(max_ploss, rem - min_gloss);
	if (Math.abs(ma - mi) < 1e-8) {
		return ` (${mi.toFixed(4)}%)`;
	}
	return ` (${mi.toFixed(4)}%~ ${ma.toFixed(4)}%)`;
});

append(5, 3, () => {
	const mi = -Math.max(min_gloss, rem - max_ploss);
	const ma = -Math.min(max_gloss, rem - min_ploss);
	if (Math.abs(ma - mi) < 1e-8) {
		return ` (${mi.toFixed(4)}%)`;
	}
	return ` (${mi.toFixed(4)}%~ ${ma.toFixed(4)}%)`;
});