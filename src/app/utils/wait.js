export const wait = (milliseconds=5000) => {
	   var start = new Date().getTime();
	   var end = start;
	   while(end < start + milliseconds) {
	     	end = new Date().getTime();
	  }
}

export default wait;
