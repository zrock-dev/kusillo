export function padWithZeros(number: number, minLength: number): string {
   let strNumber = number.toString();
   if (strNumber.length >= minLength) return strNumber;
   return `${"0".repeat(minLength - strNumber.length)}${number}`

}