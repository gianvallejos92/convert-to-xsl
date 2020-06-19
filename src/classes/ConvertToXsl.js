class ConvertToXsl extends TagsCleaner {
  constructor() {
    super();
    this.breakLineSymbol = '\n';
    this.tagsToAvoid = ['', 'a', 'span', 'o:p', 'br'];
    this.wordsToReplace = {
      key: ['&nbsp;\n', '\n', '&nbsp; ', '{! table01 }'],
      value: [' ', ' ', '&nbsp;', '{! is working fine }'],
    };
    this.tagsToReplace = {
      key: [
        '<p>', '</p>',
        '<b><u>',
        '<u><strong>', '</strong></u>',
        '<strong><u>', '</u></strong>',
        '</u></b>', '<b>',
        '</b>', '<u>',
        '</u>', '&nbsp;', '<strong>', '</strong>',
      ],
      value: [
        '<block>', '</block>',
        '<inline font-weight="bold" text-decoration="underline">',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '</inline>', '<inline font-weight="bold">',
        '</inline>', '<inline text-decoration="underline">',
        '</inline>', '', '<inline font-weight="bold">', '</inline>',
      ],
    };
    this.symbolInitial = '<p><!--if!supportLists-->';
    this.symbolToReplace = `${this.breakLineSymbol}
                            <list-block space-before="4mm" space-after="4mm">
                              <list-item>
                                <list-item-label>
                                  <block>`;
    this.endIfSymbol = '<!--endif-->';
    this.endIfToReplace = `</block>
                           </list-item-label>
                           <list-item-body>
                             <block text-indent="14mm">`;
    this.closeP = '</p>';
    this.closePToReplace = `</block>
                                </list-item-body>
                              </list-item>
                            </list-block>${this.breakLineSymbol}`;
    this.replaceFromPosition = (inputText, srtToReplace, strReplaced, position) => {
      let tmpResult = inputText;
      const from = tmpResult.substr(0, position);
      const to = tmpResult.substr(position + srtToReplace.length);
      tmpResult = from + strReplaced + to;
      return tmpResult;
    };
  }

  getInputTagsCleaned(inputText) {
    this.charInd = 0;
    const LENGTH_INPUT_TEXT = inputText.length;
    while (this.charInd < LENGTH_INPUT_TEXT) {
      if (inputText[this.charInd] === '<') {
        const currentAttributes = this.getCurrentAttributes(inputText);
        if (currentAttributes.length !== 0) {
          const currentTag = currentAttributes[0];
          if (!this.isTagToAvoid(`<${currentTag}>`)) {
            this.allStrings += `<${currentTag}>`;
          }
        }
      } else {
        this.allStrings += this.evaluateWordsToReplace(inputText);
      }
      this.charInd += 1;
    }
    return this.allStrings;
  }

  isTagToAvoid(currentTag) {
    let isTagToAvoid = false;
    this.tagsToAvoid.forEach((tag) => {
      if (`<${tag}>` === currentTag || `</${tag}>` === currentTag) isTagToAvoid = true;
    });
    return isTagToAvoid;
  }

  evaluateWordsToReplace(inputText) {
    let curWord = '';
    for (let ind = 0; ind < this.wordsToReplace.key.length; ind++) {
      curWord = this.wordsToReplace.key[ind];
      if (curWord === inputText.substr(this.charInd, curWord.length)) {
        this.charInd += curWord.length - 1;
        return this.wordsToReplace.value[ind];
      }
    }
    return inputText[this.charInd];
  }

  getCurrentAttributes(inputText) {
    const attributesArray = this.generateAttributes(inputText);
    return attributesArray;
  }

  generateAttributes(inputText) {
    let breakLoop = false;
    let attributesTemp = '';
    while (this.charInd < inputText.length && !breakLoop) {
      if (inputText[this.charInd] !== '<') {
        if (inputText[this.charInd] === '>') {
          breakLoop = true;
        } else if (this.isOpenHtmlComment(inputText)) {
          attributesTemp += this.goThruSupportList(inputText);
          this.charInd += 1;
        } else {
          attributesTemp += inputText[this.charInd];
          this.charInd += 1;
        }
      } else {
        this.charInd += 1;
      }
    }
    return attributesTemp.split(' ');
  }

  goThruSupportList(inputText) {
    let commentTemp = '';
    let breakLoop = false;
    while (this.charInd < inputText.length && !breakLoop) {
      if (inputText[this.charInd] !== '[') {
        if (inputText[this.charInd] === ']') {
          breakLoop = true;
        } else {
          commentTemp += inputText[this.charInd];
          this.charInd += 1;
        }
      } else {
        this.charInd += 1;
      }
    }
    if (!breakLoop) return undefined;
    return commentTemp.replace(/\s/g, '');
  }

  static replaceAt(input, index, replacement) {
    return input.substr(0, index) + replacement + input.substr(index + replacement.length);
  }

  generateBlocks(inputText) {
    let tmpResult = this.getInputTagsCleaned(inputText);
    let curPosition = tmpResult.indexOf(this.symbolInitial);
    let strEndIf = '';
    let strCloseP = '';
    while (curPosition !== -1) {
      tmpResult = tmpResult.replace(this.symbolInitial, this.symbolToReplace);
      while (curPosition < tmpResult.length) {
        strEndIf = tmpResult.substr(curPosition, this.endIfSymbol.length);
        strCloseP = tmpResult.substr(curPosition, this.closeP.length);
        if (strEndIf === this.endIfSymbol) {
          tmpResult = this.replaceFromPosition(tmpResult, this.endIfSymbol,
            this.endIfToReplace, curPosition);
          curPosition = curPosition + this.endIfToReplace.length;
        } else if (strCloseP === this.closeP) {
          tmpResult = this.replaceFromPosition(tmpResult, this.closeP,
            this.closePToReplace, curPosition);
          curPosition = curPosition + this.closePToReplace.length;
          break;
        }
        curPosition++;
      }
      curPosition = tmpResult.indexOf(this.symbolInitial);
    }
    return tmpResult;
  }

  convertStringToXsL(inputText) {
    let tmpResult = inputText;
    for (let ind = 0; ind < this.tagsToReplace.key.length; ind++) {
      const key = this.tagsToReplace.key[ind];
      const value = this.tagsToReplace.value[ind];
      tmpResult = tmpResult.replace(new RegExp(key, 'g'), value);
    }
    return tmpResult;
  }

  showStringConvertedXsl(inputText) {
    console.log(`InputText: ${inputText}`);
    const inputTagCleaned = this.generateBlocks(inputText);
    console.log(`Cleaned: ${inputTagCleaned}`);
    const resultXslFormatted = this.convertStringToXsL(inputTagCleaned);
    console.log(`Result: ${resultXslFormatted}`);
    return resultXslFormatted;
  }

};

ConvertToXsl.prototype.charInd = 0;
