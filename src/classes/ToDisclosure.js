class ToDisclosure extends TagsCleaner {
  constructor() {
    super();
    this.breakLineSymbol = '\n';
    this.isIndent = false;
    this.tagsToAvoid = ['', 'a', 'span', 'o:p'];
    this.wordsToReplace = {
      key: [],
      value: [],
    };
    this.tagsToReplaceObj = {};
    this.tagsInlineToReplace = {
      key: [
        '<p style="">',
        '<p>&nbsp;</p>',
        '&nbsp; ',
      ],
      value: [
        '<p>',
        '',
        ' ',
      ],
    };
    this.attributesToIdentify = {
      key: [
        'text-indent',
        'font-weight',
        'text-decoration',
      ],
      value: [
        'text-indent',
        'font-weight',
        'text-decoration',
      ],
    };

    this.getTagFromString = (inputString) => {
      const posOfFirstSpace = inputString.indexOf(' ');
      let currentTag = inputString;
      if (posOfFirstSpace !== -1) {
        currentTag = inputString.substr(0, posOfFirstSpace);
      }
      return currentTag;
    };
    this.getAttributesFromString = (inputString) => {
      const posOfFirstSpace = inputString.indexOf(' ');
      let currentAttributes = '';
      if (posOfFirstSpace !== -1) {
        currentAttributes = inputString.substr(posOfFirstSpace + 1);
      }
      return currentAttributes;
    };
    this.getEachAttribute = (inputText) => {
      const styleStr = 'style="';
      let indChar = inputText.indexOf(styleStr);
      indChar += styleStr.length;
      let tempAttributesChar = '';
      while (indChar < inputText.length) {
        if (inputText[indChar] === '"') {
          break;
        } else {
          if (inputText[indChar] !== ';' && inputText[indChar] !== ':') {
            tempAttributesChar += inputText[indChar];
          }
          indChar++;
        }
      }
      return tempAttributesChar;
    };
    this.processAttributes = (inputText) => {
      const stringOfAttributes = this.getEachAttribute(inputText).split(' ');
      let attributesResult = '';
      for (let ind = 0; ind < stringOfAttributes.length; ind++) {
        const position = this.attributesToIdentify.key.indexOf(stringOfAttributes[ind]);
        if (position !== -1) {
          if (stringOfAttributes[ind] === 'text-indent') {
            ind++;
            if (stringOfAttributes[ind] !== '0cm') {
              this.isIndent = true;
            }
          } else {
            ind++;
            attributesResult += ` ${this.attributesToIdentify.value[position]}: ${stringOfAttributes[ind]}; `;
          }
        }
      }
      return attributesResult;
    };
    this.getInputReplaced = (inputText, tagsToReplace) => {
      let tmpResult = inputText;
      for (let ind = 0; ind < tagsToReplace.key.length; ind++) {
        const key = tagsToReplace.key[ind];
        const value = tagsToReplace.value[ind];
        tmpResult = tmpResult.replace(new RegExp(key, 'g'), value);
      }
      return tmpResult;
    };
  }

  getInputTagsCleaned(inputText) {
    this.charInd = 0;
    const LENGTH_INPUT_TEXT = inputText.length;
    while (this.charInd < LENGTH_INPUT_TEXT) {
      if (inputText[this.charInd] === '<') {
        const curTagsAttributes = this.goThruAttributes(inputText);
        if (curTagsAttributes.length !== 0) {
          let currentTag = this.getTagFromString(curTagsAttributes);
          if (currentTag !== 'a' && currentTag !== 'span') {
            const tagMapped = this.tagsToReplaceObj[currentTag];
            if (tagMapped) {
              currentTag = tagMapped;
            }
            const currentAttributes = this.getAttributesFromString(curTagsAttributes);
            if (currentAttributes) {
              currentTag += ` style="${this.processAttributes(currentAttributes)}"`;
            }
            if (!this.isTagToAvoid(`<${currentTag}>`)) {
              this.allStrings += `<${currentTag}>`;
              if (this.isIndent) {
                this.allStrings += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                this.isIndent = false;
              }
            }
          }
        }
      } else {
        this.allStrings += this.evaluateWordsToReplace(inputText);
      }
      this.charInd += 1;
    }
    return this.allStrings;
  }

  goThruAttributes(inputText) {
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
        } else {
          attributesTemp += inputText[this.charInd];
          this.charInd += 1;
        }
      } else {
        this.charInd += 1;
      }
    }
    return attributesTemp;
  }

  showStringHtmlToXsl(inputText) {
    console.log(`InputText: ${inputText}`);
    const inputTagCleaned = this.getInputTagsCleaned(inputText);
    console.log(`Tags Cleaned: ${inputTagCleaned}`);
    const inputTextResult = this.getInputReplaced(inputTagCleaned, this.tagsInlineToReplace);
    console.log(`HTML Cleaned: ${inputTextResult}`);
    return inputTextResult;
  }
}

ToDisclosure.prototype.charInd = 0;
