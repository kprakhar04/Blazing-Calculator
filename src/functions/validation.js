import { casecheck } from '../helpers/casecheck';
import firstLetterCaps from './firstCapitalfunc';


const defType = 'transform';
const nondefType = 'itransform';
const dct_to_slant = ['DCT','DFT','DST','HADAMARD','WALSH','HAAR','SLANT'];
const reqDim = [2, 4, 8];
export const validation =(transform,typeOfTransform,dimension,rows,cols)=>{
if(transform.toUpperCase() === 'SLANT' && +rows === 8) {
  return firstLetterCaps('basis matrix not available');
}
else if(dct_to_slant.includes(transform.toUpperCase())){
  if(casecheck(typeOfTransform, defType) || casecheck(typeOfTransform, nondefType)){
    if(dimension==='1D'){
      if(+cols!==1 || !reqDim.includes(+rows)){
        return firstLetterCaps('1D transformation is not possible');
      }
    } else{
        if(+cols!==+rows || !reqDim.includes(+rows))   {
          return firstLetterCaps('2D transformation is not possible');
        }
    }
  } 
} else if(transform.toUpperCase() === 'KL') {
  if(+cols === 1) {
    return firstLetterCaps("KL transform is not possible")
  }
  if(casecheck(typeOfTransform, nondefType)) {
    return firstLetterCaps("inverse is not possible");
  }

} else {
  if(casecheck(typeOfTransform, nondefType)) {
    return firstLetterCaps("inverse is not possible");
  }
}
return null;
}