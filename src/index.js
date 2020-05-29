const evaluateHTML = (text) => {
    let textWithoutLine = text.split('</p>');
    let aux = '';
    let resText = '';
    for( let i = 0; i < textWithoutLine.length; i++ ){
        let curLine = textWithoutLine[i];
        console.log(`CurLine: ${curLine}`);
        if( curLine.length === 0 ){
            resText += aux;
            resText += '</p>';
            resText += '<br />';
            resText += '<br />';
            aux = '';
        }else{
          for( let j = 0; j < curLine.length; j++ ){
            aux += curLine[j];
          }
        }
    }
    if( aux !== '' ){
      resText += aux;
      resText += '</p>';
      resText += '<br />';
      resText += '<br />';
      //console.log(`Block: ${aux}\n\n`);
    }
    const resultText = document.getElementById('result');
    resultText.innerText = resText;
  }
  
  const btnSave = document.getElementById('saveBtn');
  btnSave.addEventListener('click', (e) => {
    let textFromEditor = document.getElementById('editor').innerHTML;
    console.log(textFromEditor);
    localStorage.setItem('text_in_editor', textFromEditor);
  });
  
  const btnConvert = document.getElementById('convertBtn');
  btnConvert.addEventListener('click', (e) => {
    let textFromEditor = document.getElementById('editor').innerHTML;
    evaluateHTML(textFromEditor);
  });
  
  if (localStorage.getItem('text_in_editor') !== null) {
    document.getElementById('editor').innerHTML = localStorage.getItem('text_in_editor');
  }
  
  let tagStack = [];
  let tagArray = [];
  let attributes = [];
  let allStrings = [];
  
  const generateTagAndAttributes = (inputText) => {
    let charInd = 0;
    let curInd = -1;
    let tempIntoTags = '';
    let res = '';
    while ( charInd < inputText.length ){
      if( inputText.charAt(charInd) === '<' ){      
        
        if( tempIntoTags.length !== 0 )
          allStrings.push(tempIntoTags);
        tempIntoTags = '';
        
        let tempString = '';
        charInd++;
        
        while( charInd < inputText.length && inputText.charAt(charInd) !== '>' ){
          tempString += inputText.charAt(charInd);
          charInd++;
        }            
        
        if( inputText.charAt(charInd) === '>' ){
          let tagAndAttributes = tempString.split(" ");
          let curTag = tagAndAttributes[0];        
  
          allStrings.push(`<${curTag}>`);
          tagStack.push(curTag);
          tagArray.push(curTag);
          attributes.push(...tagAndAttributes);
  
          charInd++;
        }      
  
      }else{
        if( inputText.charAt(charInd) !== '\n' )
          tempIntoTags += inputText.charAt(charInd);      
        charInd++;
      }
    }
    console.log(`All Strings: ${allStrings}`);
  }
  
  const testBtn = document.getElementById('testBtn');
  testBtn.addEventListener('click', (e) => {
    let inputText = document.getElementById('editor').innerHTML;
    generateTagAndAttributes(inputText);
    let myResult = ''
    for( let ind = 0; ind < allStrings.length; ind++ ){
      myResult += allStrings[ind];
      console.log(`!!!: ${allStrings[ind]}`);
    }
    const resultText = document.getElementById('result');
    resultText.innerText = myResult;
    console.log(`My Result: ${myResult}`);
  });