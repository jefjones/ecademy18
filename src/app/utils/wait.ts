export const wait = (milliseconds=5000) => {
	   const start = new Date().getTime()
	   let end = start
	   while(end < start + milliseconds) {
	     	end = new Date().getTime()
	  }
}

export default wait
