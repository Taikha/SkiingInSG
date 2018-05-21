var fs = require('fs');

// generate a map with solution to reduce calc time
var map = [];
var solutionMap = [];

// default solution value[length, depth] -1 = no solution
var solutionValue = [-1,-1];
var filePath = './map.txt';

var startTime = Date.now();

// init the mapTxt
var mapTxt = fs.readFileSync(filePath, 'utf8').toString().split("\n");
// dimension size 
var mapWidth = mapTxt[0].trim().split(" ")[0];
var mapHeight = mapTxt[0].trim().split(" ")[0];
console.log(mapHeight);
// initialize map array
for(var y=0; y<mapHeight; y++){
    map.push(mapTxt[y+1].trim().split(" "));
}

// Validate the result of the map
if(map.length*map[0].length === mapWidth*mapHeight) {
    // initialize solution map array
    for(var y=0; y<mapHeight; y++){
        var tempMap = [];
        for(var x=0; x<mapWidth; x++){
            tempMap.push(solutionValue);
        }
        solutionMap.push(tempMap);
    }
    console.log("True: Incoming Data File is valid !");
} else {
    console.log("False: Incoming Data File is not valid !");
}

var validNeightbour = function(row, col, callback){
    var tempList = [];
    if (map[row]!=undefined){
        if ((map[row][col-1] != undefined) && (Number(map[row][col]) > Number(map[row][col-1]))){
            tempList.push([row, col-1]);
        }
    }
    if (map[row]!=undefined){
        if ((map[row][col+1] != undefined) && (Number(map[row][col]) > Number(map[row][col+1]))){
            tempList.push([row, col+1]);
        }
    }
    if (map[row-1]!=undefined){
        if ((map[row-1][col] != undefined) && (Number(map[row][col]) > Number(map[row-1][col]))){
            tempList.push([row-1, col]);
        }
    }
    if (map[row+1]!=undefined){
        if ((map[row+1][col] != undefined) && (Number(map[row][col]) > Number(map[row+1][col]))){
            tempList.push([row+1, col]);
        }
    }
    return callback(tempList);
};

var checkNeighbour = function(row, col, tempPathLength, tempElevation, solutionValue, callback){
    // if already have a solution return it
    if(solutionMap[row][col][0] != -1){
        solutionValue.push([tempPathLength+solutionMap[row][col][0]-1, tempElevation+solutionMap[row][col][1]]);
        return callback(solutionValue);
    }
    else{
        validNeightbour(row,col,function(neighbours){
            if(neighbours != ""){
                // if there is neightbour, increase the pathlength value
                tempPathLength += 1;
                neighbours.forEach(neighbour => {
                    checkNeighbour(neighbour[0],neighbour[1],tempPathLength,tempElevation+(map[row][col]-map[neighbour[0]][neighbour[1]]), solutionValue, callback);
                });
            }
            else{
                // return if no more valid neighbour, compare updated tempPathLength and tempElevation
                solutionValue.push([tempPathLength, tempElevation]);
                return callback(solutionValue);
            }
        });
    }
}

// for each map x,y find neighbours 
// if valid neighbour, compare neighbour

var finalResult = [-1,-1];
for(var y=0; y<mapHeight; y++){
    for(var x=0; x<mapWidth; x++){
        //if north exist
        checkNeighbour(x,y,1,0,[], function(results){
            var bestResult = [0,0];
            results.forEach(result =>{
                if(result[0] > bestResult[0])
                {
                    bestResult = result;
                }
                else if(result[0] === bestResult[0])
                {
                    if(result[1] > bestResult[0]){
                        bestResult = result;
                    }
                }
            });
            // store already solve data in solution Map
            solutionMap[x][y] = [bestResult[0], bestResult[1]];
            // update final reuslt
            if(bestResult[0] > finalResult[0])
            {
                finalResult = bestResult;
            }
            else if(bestResult[0] === finalResult[0])
            {
                if(bestResult[1] > finalResult[0]){
                    finalResult = bestResult;
                }
            }
        });
    }
}

// checkNeighbour(0,0,1,0,[], function(results){
//     var bestResult = [0,0];
//     console.log(results);
//     results.forEach(result =>{
//         if(result[0] > bestResult[0])
//         {
//             bestResult = result;
//         }
//         else if(result[0] === bestResult[0])
//         {
//             if(result[1] > bestResult[0]){
//                 bestResult = result;
//             }
//         }
//     });
//     solutionMap[0][0] = [bestResult[0], bestResult[1]];
//     // update final reuslt
//     if(bestResult[0] > finalResult[0])
//     {
//         finalResult = bestResult;
//     }
//     else if(bestResult[0] === finalResult[0])
//     {
//         if(bestResult[1] > finalResult[0]){
//             finalResult = bestResult;
//         }
//     }
// });

console.log("Final Result(Lenght, Depth): " + finalResult);
var endTime = Date.now() - startTime;
console.log("Time Elapsed: " + endTime);