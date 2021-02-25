const firstLetterCaps = string => string.split(' ').map(e=> e[0].toUpperCase()+e.substring(1)).join(' ');
  
  export default firstLetterCaps;