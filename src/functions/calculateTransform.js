import * as math from 'mathjs';
import { transformationKernel } from '../helpers/transforms';
import { casecheck } from '../helpers/casecheck';
import { EigenvalueDecomposition } from 'ml-matrix';



const TO_CALCULATE = 'transform';

export const otherTransform = (input, rows, cols, dim, type, transform) => {
    try {
    const kernelObj = transformationKernel.find(ele => casecheck(ele.name, transform))
    const { kernel } = kernelObj;
    const kernelMat = kernel[rows];
    const transposedKernel = math.transpose(kernelMat);
    const inverseKernel = math.inv(kernelMat);
    
    if (casecheck(dim, '1D')) {
        if (casecheck(type, TO_CALCULATE)) {
            const result = math.multiply(kernelMat, input);
    
            return [
                { 
                    Name: "Transformation Matrix", Value: result, Desc: 'If Possible Take Common Of All Elements'
                }
            ];
        }
        else {
            const result = math.multiply(inverseKernel, input);
            
            return [
                { 
                    Name: "Reconstructed Matrix", Value: result, Desc: 'If Possible Take Common Of All Elements'
                }
            ];
        }
    }
    else {
        if (casecheck(type, TO_CALCULATE)) {
            const tempResult = math.multiply(kernelMat, input);
            const result = math.multiply(tempResult, transposedKernel);
            
            return [
                { 
                    Name: "Transformation Matrix", Value: result, Desc: 'If Possible Take Common Of All Elements'
                }
            ];
        }
        else {
            const tempResult = math.multiply(transposedKernel, input);
            const result = math.multiply(tempResult, kernelMat);
            
            return [
                { 
                    Name: "Reconstructed Matrix", Value: result, Desc: 'If Possible Take Common Of All Elements'
                }
            ];
        }
    }
} catch(e) {

    return e.message;
}
}


export const dftTransform = (input, rows, cols, dim, type, transform) => {
    try{
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (String(input[i][j]).match('i')) {
                input[i][j] = math.complex(`${input[i][j]}`);
            }
        }
    }
    const kernelObj = transformationKernel.find(ele => casecheck(ele.name, transform))
    const { kernel } = kernelObj;
    const kernelMat = kernel[rows];
    const transposedKernel = math.transpose(kernelMat);
    const conKernelMat = kernel[rows + "*"];
    const transposedConKernel = math.transpose(conKernelMat);
    let result = [];
    if (casecheck(dim, '1D')) {
        if (casecheck(type, TO_CALCULATE)) {
            result = math.multiply(kernelMat, input);
            
        }
        else {
            result = math.divide(math.multiply(conKernelMat, input), rows);
        
            
        }
    }
    else {
        if (casecheck(type, TO_CALCULATE)) {
            const tempResult = math.multiply(kernelMat, input);
            result = math.multiply(tempResult, transposedKernel);
           
            
        }
        else {
            const tempResult = math.multiply(transposedConKernel, input);
            result = math.divide(math.multiply(tempResult, conKernelMat), Math.pow(rows, 2));
            
            
        }

    }
    result = result.map(res => {
       return res.map(r => {
           if(typeof r === 'number') {
               return r;
           } 
           const {re, im} = r;
           if(im < 0) return `${re.toFixed(3)} ${im.toFixed(3)}i`;
           return `${re.toFixed(3)} + ${im.toFixed(3)}i`;
        })
    })
    
    return [
        { 
            Name: casecheck(type, TO_CALCULATE)? "Transformation Matrix" : "Reconstructed Matrix" , Value: result, Desc: ''
        }
    ];
} catch(e) {
    
    return e.message;
}

}


export const klTransform = (input, rows, cols, type) => {
    try{
    const meanMatrix = []
    for (let i = 0; i < rows; i++) {
        let sum = 0;
        for (let j = 0; j < cols; j++) {
            sum += input[i][j]/cols;
        }
        meanMatrix.push([sum]);
    }
    
    const transposedMeanMatrix = math.transpose(meanMatrix);
    
    const xxt = math.multiply(meanMatrix, transposedMeanMatrix);
    
    const xt = [];
    for (let i = 0; i < cols; i++) {
        const leftSide = [];
        for (let j = 0; j < rows; j++) {
            const temp = [input[j][i]];
            leftSide.push(temp);
        }
        
        const transposedTemp = math.transpose(leftSide);
        
        xt.push(math.multiply(leftSide, transposedTemp));
    }


    let e = math.add(xt[0], xt[1]);
    for (let i = 2; i < xt.length; i++) {
        e = math.add(e, xt[i]);
    }
    e = math.divide(e, cols);
    let factor = gcdArray(e.flat());
    factor = !Number.isInteger(factor) ? 1 : factor ; 
    e = math.divide(e, factor);
    let covarianceMat = math.subtract(e, xxt);
    
    const result = new EigenvalueDecomposition(covarianceMat);
    const eigenValues = result.realEigenvalues
    let Eig = eigenValues.reverse()
    Eig = Eig.map(ele => String(ele).match('e') ? 0 : ele);
    
    let eigenVectors = result.eigenvectorMatrix.data;
    for(let i = 0 ; i < eigenVectors.length; i++){
        eigenVectors[i] = eigenVectors[i].reverse()
    }
    let flatEigenVector = [];
    for(let i = 0; i < eigenVectors.length;i++){
        let temp = []
        for(let j = 0 ;j < eigenVectors[0].length; j++){
            temp[j]=eigenVectors[j][i]
        }
        flatEigenVector.push(temp)
    }
    flatEigenVector = flatEigenVector.map(ele => ele.map(e => String(e).match('e') ? 0 : e));
    const finalEigenVector = math.transpose(flatEigenVector);
    
    const transformationMatrix = math.transpose(finalEigenVector);
    
    let Y = [];
    for (let i = 0; i < cols; i++) {
        const tempMat = [];
        for (let j = 0; j < rows; j++) {
            const temp = [input[j][i]];
            tempMat.push(temp);
        }
        
        const tempMul = math.multiply(transformationMatrix, tempMat);
        Y.push(tempMul);
    }
    for(let i = 0; i < Y.length; i++){
        Y[i]=Y[i].flat(1)
    }
    Y=math.transpose(Y);
    
    
    const reconstructed = [];
    for (let i = 0; i < Y[0].length; i++) {
        const temp = [];
        for (let j = 0; j < Y.length; j++) {
            const ele = Y[j][i];
            temp.push(ele);
        }
        reconstructed.push(math.multiply(math.transpose(transformationMatrix), temp));
    }
    let reconstruct = math.transpose(reconstructed)
     

    return [
        {
            Name: "Covarience Matrix", Value: covarianceMat, Desc: ''
        },
        {
            Name: "Eigen Values", Value: [Eig], Desc: ''
        },

        {
            Name: "Eigen Vectors", Value: finalEigenVector, Desc: 'Column Wise And Normalized'
        },

        {
            Name: "Transformation Matrix", Value: transformationMatrix, Desc: ''
        },

        {
            Name: "Transformation Output", Value: Y, Desc: ''
        },

        {
            Name: "Reconstructed Matrix", Value: reconstruct, Desc: ''
        }    
    ]
} catch(e) {
    
    return e.message;
}
}



export const svdTransform = (input, rows, cols, type) => {
    try{
    const inputTranspose = math.transpose(input);
    const A = math.multiply(inputTranspose, input);
    
    const result = new EigenvalueDecomposition(A)
    const E = result.realEigenvalues
    let ENV = result.eigenvectorMatrix.data
    let EigenVal = E.reverse();
    EigenVal = EigenVal.map(ele => String(ele).match('e') ? 0 : ele);
    
    let tempU = [];
    ENV = ENV.map(ele => ele.map(e => String(e).match('e') ? 0 : e));

    for (let i = 0; i < ENV.length; i++) {
        const temp = [];
        for (let j = 0; j < ENV[0].length; j++) {
            temp.push([ENV[j][i]]);
        }
        
        let column = math.multiply(input,temp)
        column = column.map(ele => String(ele).match('e') ? [0] : ele)
        column = norm(column)
        
        for(let i = 0; i < column.length; i++){
            for( let j = 0; j < column[0].length; j++){
                if(Number.isNaN(column[i][j])){
                    column[i][j] = 0;
                }
            }
        }
        tempU.push(column);
    }
    tempU = tempU.reverse();
    
    for(let i = 0; i < tempU.length; i++){
        tempU[i]=tempU[i].flat(1)
    }
    tempU=math.transpose(tempU);
    
    
    const summVector = [];

    for (let i = 0; i < EigenVal.length; i++) {
        const temp = [];
        for (let j = 0; j < EigenVal.length; j++) {
            temp[j] = i === j ? Math.sqrt(EigenVal[j]) : 0;
            if (Number.isNaN(temp[j])) temp[j] = 0;
        }
        summVector.push(temp);
    }
    
    let flatEigenVector = [];
    for(let i=ENV.length-1;i>=0;i--){
        let temp = []
        let count = 0;
        for(let j = 0 ;j < ENV[0].length; j++){
            temp[count]=ENV[count][i]
            count++
        }
        flatEigenVector.push(temp)
    }
    const finalEigenVector = math.transpose(flatEigenVector);
    
    for (let i = 0; i < flatEigenVector.length; i++ ){
        flatEigenVector[i] = flatEigenVector[i].flat(1)
    }

    const temp = math.multiply(tempU, summVector);
    const reconstructed = math.multiply(temp, flatEigenVector);
    

    return [
        {
            Name: "Covarience Matrix", Value: A, Desc: ''
        },
        {
            Name: "Eigen Values", Value: [EigenVal], Desc: ''
        },

        {
            Name: "Eigen Vectors", Value: finalEigenVector, Desc: 'Column Wise And Normalized'
        },

        {
            Name: "Matrix U", Value: tempU, Desc: ''
        },

        {
            Name: "Sum.. Vector", Value: summVector, Desc: ''
        },

        {
            Name: "Reconstructed Matrix", Value: reconstructed, Desc: ''
        }    
    ]
} catch(e) {

    return e.message;
}

}





const gcdArray = input => {

    let len, a, b;
    len = input.length;
    if (!len) {
        return null;
    }
    a = input[0];
    for (let i = 1; i < len; i++) {
        b = input[i];
        a = gcd_two_numbers(a, b);
    }
    return a;
}

const gcd_two_numbers = (x, y) => {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

const norm = mat => {
    let sum = 0;
    const temp = mat.flat();
    for (let i = 0; i < temp.length; i++) {
        sum += Math.pow(temp[i], 2);
    }
    sum = Math.sqrt(sum);
    const normMat = math.divide(mat, sum);
    return normMat;
}