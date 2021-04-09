export default function countValue(handArray) {
  let sum = 0;
  for (let i = 0; i < handArray.length; i += 1) {
    sum += handArray[i].value;
  }
  console.log(sum);
  return sum;
}
