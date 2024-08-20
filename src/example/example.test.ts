import {add} from "./index"
// import {test} from "jest"

describe("Adds two numbers together", () => {
    test("Checks basic function", () => {
        let sum = add(2, 4)

        expect(sum).toBe(6)
    })

    test("Checks nested usage", () => {
        let sum = add(
            add(2, 4),
            add(9, -2)
        )

        expect(sum).toBe(13)
    })
})