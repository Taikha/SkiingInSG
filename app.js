var fs = require('fs');

var filePath = process.argv[2];

var startTime = Date.now();

var mapTxt = fs.readFileSync(filePath, 'utf8').toString();
var mapLines = mapTxt.trim().split("\n");

var dimension = mapLines.shift().trim().split(" ");
var mapWidth = dimension[0];
var mapHeight = dimension[1];

var map = [];

map = mapLines.map(function(result, y){
    return result.trim().split(" ").map(function(result, x){
        resultInNum = +result;
        return {x, y, value: resultInNum, pathLength: -1, pathDepth: -1};
    });
});

if(map.length*map[0].length === mapWidth*mapHeight) {
    console.log("True: Incoming Data File is valid !");
} else {
    console.log("False: Incoming Data File is not valid !");
}

var checkNeighbourNum = function(row, col, tempPathLength, tempElevation, callback){
    if(map[row][col].pathLength != -1){
        return callback([tempPathLength+map[row][col].pathLength, tempElevation+map[row][col].value]);
    }
    else{
        tempPathLength += 1;
        if(col-1 > 0){
            if (map[row][col].value > map[row][col-1].value){
                checkNeighbourNum(row, col-1, tempPathLength, tempElevation+(map[row][col].value-map[row][col-1].value), callback);
            }
        }
        if(col+1 < mapWidth){
            if (map[row][col].value > map[row][(col+1)].value){
                checkNeighbourNum(row, col+1, tempPathLength, tempElevation+(map[row][col].value-map[row][col+1].value), callback);
            }
        }
        if(row-1 > 0){
            if (map[row][col].value > map[(row-1)][col].value){
                checkNeighbourNum(row-1, col, tempPathLength, tempElevation+(map[row][col].value-map[row-1][col].value), callback);
            }
        }
        if(row+1 < mapHeight){
            if (map[row][col].value > map[(row+1)][col].value){
                checkNeighbourNum(row+1, col, tempPathLength, tempElevation+(map[row][col].value-map[row+1][col].value) ,callback);
            }
        }
        return callback([tempPathLength, tempElevation]);
    }
}
var finalResult = [-1,-1];
for(var y=0; y<mapHeight; y++){
    for(var x=0; x<mapWidth; x++){
        var bestResult = [-1, -1];
        checkNeighbourNum(y, x, 0, 0, function(results){
            if(results[0] > bestResult[0]){
                bestResult[0] = results[0];
            }else if(results[0] === bestResult[0]){
                if(results[1] > bestResult[1]){
                    bestResult = results;
                }
            }
            map[y][x].pathLength = bestResult[0];
            map[y][x].pathDepth = bestResult[1];
        });
        if (bestResult[0] > finalResult[0]){
            finalResult = bestResult;
        } else if(bestResult[0] === finalResult[0]){
            if(bestResult[1] > finalResult[1]){
                finalResult = bestResult;
            }
        }
    }
}
console.log("==========================================");
console.log("Best slope length is " + finalResult[0]);
console.log("Drop is " +finalResult[1]);
console.log("==========================================");
var endTime = Date.now() - startTime;
console.log("Time Elapsed: " + endTime/1000 + " seconds.");