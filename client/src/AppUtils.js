
function wait(tMillisec)
{
 const start = Date.now();
 while ( Date.now() - start < tMillisec ) {}
} 

/*
function useToggle (initialValue = true) {
  const [value, setValue] = useState(initialValue)
  const toggle = function () {
      setValue(v => !v)
  }
  return [value, toggle]
}

*/
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

export { wait, zeroPad };
