import { IEnumerator } from "./IEnumerator"

const EPSILON: number = 0.00001;
const PiBy180: number = 0.017453292519943295;

export class vec2 {
	public values: Float32Array;

	public constructor(x: number = 0, y: number = 0) {
		this.values = new Float32Array([x, y]);
	}

	public toString(): string {
		return " [ " + this.values [0] + " , " + this.values [1] + " ] ";
	}

	public get x(): number {
		return this.values [0];
	}

	public set x(x: number) {
		this.values [0] = x;
	}

	public get y(): number {
		return this.values [1];
	}

	public set y(y: number) {
		this.values [1] = y;
	}

	public reset(x: number = 0, y: number): vec2 {
		this.values[0] = x;
		this.values[1] = y;
		return this;
	}

	public equals(vector: vec2): boolean {
		if (Math.abs(this.values[0] - vector.values [0]) > EPSILON)
			return false;

		if (Math.abs(this.values[1] - vector.values[1]) > EPSILON)
			return false;

		return true;
	}

	public negative(): vec2 {
		this.values [0] = -this.values [0];
		this.values [1] = -this.values [1];
		return this;
	}

	public get squaredLength(): number {
		let x = this.values [0];
		let y = this.values [1];
		return (x * x + y * y);
	}

	public get length(): number {
		return Math.sqrt(this.squaredLength);
	}

	public normalize(): number {
		let len: number = this.length;
		if (Math2D.isEquals(len, 0)) {
			console.log(" the length = 0 ");
			this.values [0] = 0;
			this.values [1] = 0;
			return 0;
		}

		if (Math2D.isEquals(len, 1)) {
			console.log(" the length = 1 ");
			return 1.0;
		}

		this.values [0] /= len;
		this.values [1] /= len;
		return len;
	}

	public static create(x: number = 0, y: number = 0): vec2 {
		return new vec2(x, y);
	}

	public add(right: vec2): vec2 {
		vec2.sum(this, right, this);
		return this;
	}

	public static sum(left: vec2, right: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values [0] = left.values [0] + right.values [0];
		result.values [1] = left.values [1] + right.values [1];
		return result;
	}

	public substract(another: vec2): vec2 {
		vec2.difference(this, another, this);
		return this;
	}

	public static difference(end: vec2, start: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values [0] = end.values [0] - start.values [0];
		result.values [1] = end.values [1] - start.values [1];
		return result;
	}

	public static copy(src: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values[0] = src.values[0];
		result.values[1] = src.values[1];
		return result;
	}

	public static scale(direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		result.values [0] = direction.values [0] * scalar;
		result.values [1] = direction.values [1] * scalar;
		return result;
	}

	public static scaleAdd(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		vec2.scale(direction, scalar, result);
		return vec2.sum(start, result, result);
	}

	public static moveTowards(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
		if (result === null) result = new vec2();
		vec2.scale(direction, scalar, result);
		return vec2.sum(start, result, result);
	}

	public innerProduct(right: vec2): number {
		return vec2.dotProduct(this, right);
	}

	public static dotProduct(left: vec2, right: vec2): number {
		return left.values[0] * right.values[0] + left.values[1] * right.values[1];
	}

	public static crossProduct(left: vec2, right: vec2): number {
		return left.x * right.y - left.y * right.x;
	}

	public static getOrientation(from: vec2, to: vec2, isRadian: boolean = false): number {
		let diff: vec2 = vec2.difference(to, from);
		let radian = Math.atan2(diff.y, diff.x);
		if (isRadian === false) {
			radian = Math2D.toDegree(radian);
		}
		return radian;
	}

	public static getAngle(a: vec2, b: vec2, isRadian: boolean = false): number {
		let dot: number = vec2.dotProduct(a, b);
		let radian: number = Math.acos(dot / (a.length * b.length));
		if (isRadian === false) {
			radian = Math2D.toDegree(radian);
		}
		return radian;
	}

	public static cosAngle(a: vec2, b: vec2, norm: boolean = false): number {
		if (norm === true) {
			a.normalize();
			b.normalize();
		}
		return vec2.dotProduct(a, b);
	}

	public static sinAngle(a: vec2, b: vec2, norm: boolean = false): number {
		if (norm === true) {
			a.normalize();
			b.normalize();
		}
		return (a.x * b.y - b.x * a.y);
	}

	public static zero = new vec2(0, 0);
	public static xAxis = new vec2(1, 0);
	public static yAxis = new vec2(0, 1);
	public static nXAxis = new vec2(-1, 0);
	public static nYAxis = new vec2(0, -1);
	public static temp = new vec2(0, 0);
	public static temp1 = new vec2(0, 0);

}

export class vec3 {
	public values: Float32Array;

	public constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.values = new Float32Array([x, y, z]);
	}

	public get x(): number {
		return this.values [0];
	}

	public set x(x: number) {
		this.values [0] = x;
	}

	public get y(): number {
		return this.values [1];
	}

	public set y(y: number) {
		this.values [1] = y;
	}

	public get z(): number {
		return this.values [2];
	}

	public set z(z: number) {
		this.values [2] = z;
	}

	public static cross(v1: vec3, v2: vec3, out: vec3 | null = null): vec3 {
		if (out === null) out = new vec3();
		out.x = v1.y * v2.z - v1.z * v2.y;
		out.y = v1.z * v2.x - v1.x * v2.z;
		out.z = v1.x * v2.y - v1.y * v2.x;
		return out;
	}

	public toString(): string {
		return " [ " + this.values [0] + " , " + this.values [1] + " , " + this.values [2] + " ] ";
	}
}

export class mat2d {
	public values: Float32Array;

	public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, x: number = 0, y: number = 0) {
		this.values = new Float32Array([a, b, c, d, x, y]);
	}

	public identity(): void {
		this.values [0] = 1.0;
		this.values [1] = 0.0;
		this.values [2] = 0.0;
		this.values [3] = 1.0;
		this.values [4] = 0.0;
		this.values [5] = 0.0;
	}

	public static create(a: number = 1, b: number = 0, c: number = 0, d: number = 1, x: number = 0, y: number = 0): mat2d {
		return new mat2d(a, b, c, d, x, y);
	}

	public get xAxis(): vec2 {
		return vec2.create(this.values [0], this.values [1]);
	}

	public get yAxis(): vec2 {
		return vec2.create(this.values [2], this.values [3]);
	}

	public get origin(): vec2 {
		return vec2.create(this.values [4], this.values [5])
	}

	public getAngle(isRadian: boolean = false): number {
		let angle: number = Math.atan2(this.values [1], this.values [0]);
		if (isRadian) {
			return angle;
		}
		return angle / PiBy180;
	}

	public static copy(src: mat2d, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values[0] = src.values[0];
		result.values[1] = src.values[1];
		result.values[2] = src.values[2];
		result.values[3] = src.values[3];
		result.values[4] = src.values[4];
		result.values[5] = src.values[5];
		return result;
	}


	public static multiply(left: mat2d, right: mat2d, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();

		let a0: number = left.values [0];
		let a1: number = left.values [1];
		let a2: number = left.values [2];
		let a3: number = left.values [3];
		let a4: number = left.values [4];
		let a5: number = left.values [5];

		let b0: number = right.values [0];
		let b1: number = right.values [1];
		let b2: number = right.values [2];
		let b3: number = right.values [3];
		let b4: number = right.values [4];
		let b5: number = right.values [5];

		result.values [0] = a0 * b0 + a2 * b1;
		result.values [1] = a1 * b0 + a3 * b1;
		result.values [2] = a0 * b2 + a2 * b3;
		result.values [3] = a1 * b2 + a3 * b3;
		result.values [4] = a0 * b4 + a2 * b5 + a4;
		result.values [5] = a1 * b4 + a3 * b5 + a5;

		return result;
	}

	public static determinant(mat: mat2d): number {
		return mat.values [0] * mat.values [3] - mat.values [2] * mat.values [1];
	}

	public static invert(src: mat2d, result: mat2d): boolean {
		let det: number = mat2d.determinant(src);

		if (Math2D.isEquals(det, 0)) {
			return false;
		}

		det = 1.0 / det;

		result.values [0] = src.values [3] * det;
		result.values [1] = -src.values [1] * det;
		result.values [2] = -src.values [2] * det;
		result.values [3] = src.values [0] * det;
		result.values [4] = (src.values [2] * src.values [5] - src.values [3] * src.values [4]) * det;
		result.values [5] = (src.values [1] * src.values [4] - src.values [0] * src.values [5]) * det;
		return true;
	}

	public static makeRotation(radians: number, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		let s: number = Math.sin(radians), c: number = Math.cos(radians);
		result.values [0] = c;
		result.values [1] = s;
		result.values [2] = -s;
		result.values [3] = c;
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public onlyRotationMatrixInvert(): mat2d {
		let s: number = this.values [1];
		this.values [1] = this.values [2];
		this.values [2] = s;
		return this;
	}

	public static makeRotationFromVectors(v1: vec2, v2: vec2, norm: boolean = false, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values [0] = vec2.cosAngle(v1, v2, norm);
		result.values [1] = vec2.sinAngle(v1, v2, norm);
		result.values [2] = -vec2.sinAngle(v1, v2, norm);
		result.values [3] = vec2.cosAngle(v1, v2, norm);
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public static makeReflection(axis: vec2, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values [0] = 1 - 2 * axis.x * axis.x;
		result.values [1] = -2 * axis.x * axis.y;
		result.values [2] = -2 * axis.x * axis.y;
		result.values [3] = 1 - 2 * axis.y * axis.y;
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public static makeXSkew(sx: number, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values [0] = 1;
		result.values [1] = 0;
		result.values [2] = sx;
		result.values [3] = 1;
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public static makeYSkew(sy: number, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values [0] = 1;
		result.values [1] = sy;
		result.values [2] = 0;
		result.values [3] = 1;
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public static makeTranslation(tx: number, ty: number, result: mat2d | null = null): mat2d {
		if (result === null) result = new mat2d();
		result.values [0] = 1;
		result.values [1] = 0;
		result.values [2] = 0;
		result.values [3] = 1;

		result.values [4] = tx;
		result.values [5] = ty;
		return result;
	}

	public static makeScale(sx: number, sy: number, result: mat2d | null = null): mat2d {
		if (Math2D.isEquals(sx, 0) || Math2D.isEquals(sy, 0)) {
			alert(" x轴或y轴缩放系数为0 ");
			throw new Error(" x轴或y轴缩放系数为0 ");
		}

		if (result === null) result = new mat2d();
		result.values [0] = sx;
		result.values [1] = 0;
		result.values [2] = 0;
		result.values [3] = sy;
		result.values [4] = 0;
		result.values [5] = 0;
		return result;
	}

	public static temp1 = mat2d.create();
	public static temp2 = mat2d.create();
	public static quadBezierBasicMatrix = mat2d.create(1, -2, -2, 2, 1, 0);
}

export class MatrixStack {
	private _mats: mat2d [ ];

	public constructor() {
		this._mats = [];
		this._mats.push(new mat2d());
	}

	public get matrix(): mat2d {
		if (this._mats.length === 0) {
			alert(" 矩阵堆栈为空 ");
			throw new Error(" 矩阵堆栈为空 ");
		}

		return this._mats [this._mats.length - 1];
	}

	public pushMatrix(): void {
		let mat: mat2d = mat2d.copy(this.matrix);
		this._mats.push(mat);
	}

	public popMatrix(): void {
		if (this._mats.length === 0) {
			alert(" 矩阵堆栈为空 ");
			return;
		}
		this._mats.pop();
	}

	public loadIdentity(): void {
		this.matrix.identity();
	}

	public loadMatrix(mat: mat2d): void {
		mat2d.copy(mat, this.matrix);
	}

	public multMatrix(mat: mat2d): void {
		mat2d.multiply(this.matrix, mat, this.matrix);
	}

	public translate(x: number = 0, y: number = 0): void {
		let mat: mat2d = mat2d.makeTranslation(x, y);
		this.multMatrix(mat);
	}

	public rotate(degree: number = 0, isRadian: boolean = false): void {
		if (isRadian === false) {
			degree = Math2D.toRadian(degree);
		}
		let mat: mat2d = mat2d.makeRotation(degree);
		this.multMatrix(mat);
	}

	public rotateFrom(v1: vec2, v2: vec2, norm: boolean = false): void {
		let mat: mat2d = mat2d.makeRotationFromVectors(v1, v2, norm);
		this.multMatrix(mat);
	}

	public scale(x: number = 1.0, y: number = 1.0): void {
		let mat: mat2d = mat2d.makeScale(x, y);
		this.multMatrix(mat);
	}

	public invert(): mat2d {
		let ret: mat2d = new mat2d();
		if (mat2d.invert(this.matrix, ret) === false) {
			alert(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
			throw new Error(" 堆栈顶部矩阵为奇异矩阵，无法求逆 ");
		}
		return ret;
	}
}

export class Math2D {
	public static toRadian(degree: number): number {
		return degree * PiBy180;
	}

	public static toDegree(radian: number): number {
		return radian / PiBy180;
	}

	public static random(from: number, to: number): number {
		return Math.random() * to + from;
	}

	public static angleSubtract(from: number, to: number): number {
		let diff: number = to - from;
		while (diff > 180) {
			diff -= 360;
		}

		while (diff < -180) {
			diff += 360;
		}

		return diff;
	}

	public static isEquals(left: number, right: number, espilon: number = EPSILON): boolean {
		if (Math.abs(left - right) >= EPSILON) {
			return false;
		}
		return true;
	}

	public static getQuadraticBezierPosition(start: number, ctrl: number, end: number, t: number): number {
		if (t < 0.0 || t > 1.0) {
			alert(" t的取值范围必须为[ 0 , 1 ] ");
			throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
		}
		let t1: number = 1.0 - t;
		let t2: number = t1 * t1;
		return t2 * start + 2.0 * t * t1 * ctrl + t * t * end;
	}

	public static getQuadraticBezierVector(start: vec2, ctrl: vec2, end: vec2, t: number, result: vec2 | null = null): vec2 {
		if (result === null) result = vec2.create();
		result.x = Math2D.getQuadraticBezierPosition(start.x, ctrl.x, end.x, t);
		result.y = Math2D.getQuadraticBezierPosition(start.y, ctrl.y, end.y, t);
		return result;
	}

	public static getQuadraticBezierMat(start: vec2, ctrl: vec2, end: vec2, t: number, result: vec2 | null = null): vec2 {
		if (result === null) result = vec2.create();

		return result;
	}

	public static getCubicBezierPosition(start: number, ctrl0: number, ctrl1: number, end: number, t: number): number {
		if (t < 0.0 || t > 1.0) {
			alert(" t的取值范围必须为[ 0 , 1 ] ");
			throw new Error(" t的取值范围必须为[ 0 , 1 ] ");
		}
		let t1: number = (1.0 - t);
		let t2: number = t * t;
		let t3: number = t2 * t;
		return (t1 * t1 * t1) * start + 3 * t * (t1 * t1) * ctrl0 + (3 * t2 * t1) * ctrl1 + t3 * end;
	}

	public static getCubicBezierVector(start: vec2, ctrl0: vec2, ctrl1: vec2, end: vec2, t: number, result: vec2 | null = null): vec2 {
		if (result === null) result = vec2.create();
		result.x = Math2D.getCubicBezierPosition(start.x, ctrl0.x, ctrl1.x, end.x, t);
		result.y = Math2D.getCubicBezierPosition(start.y, ctrl0.y, ctrl1.y, end.y, t);
		return result;
	}

	public static createQuadraticBezierEnumerator(start: vec2, ctrl: vec2, end: vec2, steps: number = 30): IBezierEnumerator {
		return new BezierEnumerator(start, end, ctrl, null, steps);
	}

	public static createCubicBezierEnumerator(start: vec2, ctrl0: vec2, ctrl1: vec2, end: vec2, steps: number = 30): IBezierEnumerator {
		return new BezierEnumerator(start, end, ctrl0, ctrl1, steps);
	}

	public static projectPointOnLineSegment(pt: vec2, start: vec2, end: vec2, closePoint: vec2): boolean {
		let v0: vec2 = vec2.create();
		let v1: vec2 = vec2.create();
		let d: number = 0;

		vec2.difference(pt, start, v0);
		vec2.difference(end, start, v1);
		d = v1.normalize();

		let t: number = vec2.dotProduct(v0, v1);
		if (t < 0) {
			closePoint.x = start.x;
			closePoint.y = start.y;
			return false;
		} else if (t > d) {
			closePoint.x = end.x;
			closePoint.y = end.y;
			return false;
		} else {
			vec2.scaleAdd(start, v1, t, closePoint);
			return true;
		}
	}

	public static isPointOnLineSegment(pt: vec2, start: vec2, end: vec2, radius: number = 2): boolean {
		let closePt: vec2 = vec2.create();
		if (Math2D.projectPointOnLineSegment(pt, start, end, closePt) === false) {
			return false;
		}
		return Math2D.isPointInCircle(pt, closePt, radius);
	}

	public static isPointInCircle(pt: vec2, center: vec2, radius: number): boolean {
		let diff: vec2 = vec2.difference(pt, center);
		let len2: number = diff.squaredLength;
		if (len2 <= radius * radius) {
			return true;
		}
		return false;
	}

	public static isPointInRect(ptX: number, ptY: number, x: number, y: number, w: number, h: number): boolean {
		if (ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h) {
			return true;
		}
		return false;
	}

	public static isPointInEllipse(ptX: number, ptY: number, centerX: number, centerY: number, radiusX: number, radiusY: number): boolean {
		let diffX = ptX - centerX;
		let diffY = ptY - centerY;
		let n: number = (diffX * diffX) / (radiusX * radiusX) + (diffY * diffY) / (radiusY * radiusY);
		return n <= 1.0;
	}

	public static sign(v0: vec2, v1: vec2, v2: vec2): number {
		let e1: vec2 = vec2.difference(v0, v2);
		let e2: vec2 = vec2.difference(v1, v2);
		return vec2.crossProduct(e1, e2);
	}

	public static isPointInTriangle(pt: vec2, v0: vec2, v1: vec2, v2: vec2) {
		let b1: boolean = Math2D.sign(v0, v1, pt) < 0.0;
		let b2: boolean = Math2D.sign(v1, v2, pt) < 0.0;
		let b3: boolean = Math2D.sign(v2, v0, pt) < 0.0;
		return ((b1 === b2) && (b2 === b3));
	}

	public static isPointInPolygon(pt: vec2, points: vec2 [ ]): boolean {
		if (points.length < 3) {
			return false;
		}
		for (let i: number = 2; i < points.length; i++) {
			if (Math2D.isPointInTriangle(pt, points [0], points [i - 1], points [i])) {
				return true;
			}
		}
		return false;
	}

	public static isConvex(points: vec2 [ ]): boolean {
		let sign: boolean = Math2D.sign(points [0], points [1], points [2]) < 0;
		let j: number, k: number;
		for (let i: number = 1; i < points.length; i++) {
			j = (i + 1) % points.length;
			k = (i + 2) % points.length;
			if (sign !== Math2D.sign(points [i], points [j], points [k]) < 0) {
				return false;
			}
		}
		return true;
	}

	public static transform(mat: mat2d, pt: vec2, result: vec2 | null = null): vec2 {
		if (result === null) result = vec2.create();
		result.values [0] = mat.values [0] * pt.values [0] + mat.values[2] * pt.values [1] + mat.values [4];
		result.values [1] = mat.values [1] * pt.values [0] + mat.values[3] * pt.values[1] + mat.values[5];
		return result;
	}

	public static matStack: MatrixStack = new MatrixStack();
}

export class Size {
	public values: Float32Array;

	public constructor(w: number = 1, h: number = 1) {
		this.values = new Float32Array([w, h]);
	}

	set width(value: number) {
		this.values [0] = value;
	}

	get width(): number {
		return this.values [0];
	}

	set height(value: number) {
		this.values [1] = value;
	}

	get height(): number {
		return this.values [1];
	}

	public static create(w: number = 1, h: number = 1): Size {
		return new Size(w, h);
	}
}

export class Rectangle {
	public origin: vec2;
	public size: Size;

	public constructor(origin: vec2 = new vec2(), size: Size = new Size(1, 1)) {
		this.origin = origin;
		this.size = size;
	}

	public isEmpty() {
		let area: number = this.size.width * this.size.height;
		return Math2D.isEquals(area, 0);
	}

	public static create(x: number = 0, y: number = 0, w: number = 1, h: number = 1): Rectangle {
		let origin: vec2 = new vec2(x, y);
		let size: Size = new Size(w, h);
		return new Rectangle(origin, size);
	}
}

export class Inset {
	public values: Float32Array;

	public constructor(l: number = 0, t: number = 0, r: number = 0, b: number = 0) {
		this.values = new Float32Array([l, t, r, b]);
	}

	public get leftMargin(): number {
		return this.values [0];
	}

	public set leftMargin(value: number) {
		this.values [0] = value;
	}

	public get topMargin(): number {
		return this.values [1];
	}

	public set topMargin(value: number) {
		this.values [1] = value;
	}

	public get rightMargin(): number {
		return this.values [2];
	}

	public set rightMargin(value: number) {
		this.values [2] = value;
	}

	public get bottomMargin(): number {
		return this.values [3];
	}

	public set bottomMargin(value: number) {
		this.values [3] = value;
	}
}

export class Transform2D {
	public position: vec2;
	public rotation: number;
	public scale: vec2;

	public constructor(x: number = 0, y: number = 0, rotation: number = 0, scaleX: number = 1, scaleY: number = 1) {
		this.position = new vec2(x, y);
		this.rotation = rotation;
		this.scale = new vec2(scaleX, scaleY);
	}

	public toMatrix(): mat2d {
		Math2D.matStack.loadIdentity();
		Math2D.matStack.translate(this.position.x, this.position.y);
		Math2D.matStack.rotate(this.rotation, false);
		Math2D.matStack.scale(this.scale.x, this.scale.y);
		return Math2D.matStack.matrix;
	}

	public toInvMatrix(result: mat2d): boolean {
		let mat: mat2d = this.toMatrix();
		return mat2d.invert(mat, result);
	}
}


export interface IBezierEnumerator extends IEnumerator <vec2> {
	steps: number;
}

export class BezierEnumerator implements IBezierEnumerator {
	private _steps: number;
	private _i: number;
	private _startAnchorPoint: vec2;
	private _endAnchorPoint: vec2;
	private _controlPoint0: vec2;
	private _controlPoint1: vec2 | null;
	private _currentIdx: number;

	public constructor(start: vec2, end: vec2, control0: vec2, control1: vec2 | null = null, steps: number = 30) {
		this._startAnchorPoint = start;
		this._endAnchorPoint = end;
		this._controlPoint0 = control0;
		if (control1 !== null) {
			this._controlPoint1 = control1;
		} else {
			this._controlPoint1 = null;
		}
		this._steps = steps;
		this._i = 1.0 / (this._steps);
		this._currentIdx = -1;
	}

	public reset(): void {
		this._currentIdx = -1;
	}

	public get current(): vec2 {
		if (this._controlPoint1 !== null) {
			return Math2D.getCubicBezierVector(this._startAnchorPoint, this._controlPoint0, this._controlPoint1, this._endAnchorPoint, this._currentIdx * this._i);
		} else {
			return Math2D.getQuadraticBezierVector(this._startAnchorPoint, this._controlPoint0, this._endAnchorPoint, this._currentIdx * this._i);
		}
	}

	public moveNext(): boolean {
		this._currentIdx++;
		return this._currentIdx < this._steps;
	}

	public get steps(): number {
		this._i = 1.0 / (this._steps);
		return this._steps;
	}

	public set steps(steps: number) {
		this._steps = steps;
		this.reset();
	}
}

export class QuadraticBezierEnumerator implements IBezierEnumerator {
	private _steps: number;
	private _i !: number;
	private _startAnchorPoint: vec2;
	private _endAnchorPoint: vec2;
	private _controlPoint0: vec2;
	private _currentIdx: number;

	public constructor(start: vec2, end: vec2, control0: vec2, steps: number = 30) {
		this._startAnchorPoint = start;
		this._endAnchorPoint = end;
		this._controlPoint0 = control0;
		this._steps = steps;
		this._i = 1.0 / (this._steps);
		this._currentIdx = -1;
	}

	public reset(): void {
		this._currentIdx = -1;
	}

	public get current(): vec2 {
		let t: number = this._currentIdx * this._i;
		let ret: vec2 = vec2.create(t * t, t);
		Math2D.transform(mat2d.quadBezierBasicMatrix, ret, ret);
		ret.x = this._startAnchorPoint.x * ret.x + this._controlPoint0.x * ret.y + this._endAnchorPoint.x;
		ret.y = this._startAnchorPoint.y * ret.x + this._controlPoint0.y * ret.y + this._endAnchorPoint.y;
		return ret;
	}

	public moveNext(): boolean {
		this._currentIdx++;
		return this._currentIdx < this._steps;
	}

	public get steps(): number {
		this._i = 1.0 / (this._steps);
		return this._steps;
	}

	public set steps(steps: number) {
		this._steps = steps;
		this.reset();
	}

}
