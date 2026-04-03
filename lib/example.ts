import { type } from "os";

type brand = String;

interface Car {
    brand: brand,
    model: String,
    years: number,
    isPetrol: boolean,
    contry: contry
}
interface contry {
    location: String,
    birde: String

}
interface coloreCar extends Car {
    color?: String
}

const Car: Car = {
    brand: "mongoose",
    model: "V8",
    years: 2002,
    isPetrol: false,
    contry: {
        location: "maladiwain",
        birde: "ISruile",

    }

}

const mycar: coloreCar = {
    color: "Reed",
    brand: "mongoo",
    model: "vf",
    years: 555,
    isPetrol: true,
    contry: {
        location: "parice",
        birde: "vfe"
    }
}

console.log(Car)
console.log(mycar)