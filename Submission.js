// The following is how I see call-backs or "higher order functions"

const compute = (n1, n2, callback) => callback(n1, n2);
const sum = (n1, n2) => n1 + n2;
const product = (n1, n2) => n1 * n2;

console.log(compute(5, 3, sum)); 
console.log(compute(5, 3, product)); 

//As you can see the function compute takes two numbers and a callback function. This callback function can be sum, product and any other that you develop that operates two numbers.

//2.Here's a program  to print pattern 1,3,6,10,15...
function seriesSum(n, patternArr)
{
    let sum = 0;
    var patternArr = [];
    for (let i = 0; i <= n; i++){
       sum += i;
       patternArr.push(sum);}
    return patternArr;
    
}
console.log(seriesSum(5));

//pattern can be seen inside the array that will be logged