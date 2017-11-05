const express = require('express');
const app = express();

//  requires that floor, ceiling, and start be passed in as query params example
//  http://localhost:8080/elevator?floor=0&ceiling=19&start=10
app.get('/elevator', (req, res) => {
    let floor = parseInt(req.query.floor);
    let ceiling = parseInt(req.query.ceiling);
    let start = parseInt(req.query.start);

    //error checking
    if ((!floor && floor !== 0) || (!ceiling && ceiling !== 0) || (!start && start !== 0)) {
        res.status(400).json({
            "error": "Oops! Looks like you forgot the floor, ceiling, and/or start query params."
        })
    } else {
        //second layer of error check
        if (floor >= ceiling) {
            res.status(400).json({
                "error": "Oops! Floor must be less than ceiling, this isn't upsidedown world silly."
            })
        } else if ((start < floor) || (start > ceiling)){
            res.status(400).json({
                "error": "Oops! Start must be between floor and ceiling, this isn't Willy Wonka's glass elevator."
            })
        } else {
            //no errors run this
            let result = move(floor, ceiling, start);
            res.status(200).json(result);
        }

    }

    function move(floor, ceiling, start) {

        let directions = ['u1', 'd5', 'u2', 'u9', 'd14'];
        let distance = 0;
        let currentPos = start;
        for (let i = 0; i < directions.length; i++) {
            let currentDirection = directions[i];
            let curentDistance = parseInt(currentDirection.slice(1));
            if (currentDirection.slice(0, 1) === 'u') { //going up
                distance += curentDistance; //distance traveled
                currentPos += curentDistance; //ending floor for each index of directions
                if (currentPos > ceiling) {
                    let dif = currentPos - ceiling;
                    currentPos = ceiling;
                    distance -= dif;
                }
            } else if (currentDirection.slice(0, 1) === 'd') { //going down
                distance += curentDistance; //distance traveled
                currentPos -= curentDistance; //ending floor for each index of directions
                if (currentPos < floor) {
                    let dif = floor - currentPos;
                    currentPos = floor;
                    distance -= dif;
                }
            }
        }
        let distanceFromStart = currentPos - start;
        return {
            "Total Distance Traveled": distance,
            "End": currentPos,
            "Distance From Start": distanceFromStart
        }
    }
    

})



app.listen('8080', () => {
    console.log('Magic happens on port 8080');
})
