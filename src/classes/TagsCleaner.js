class TagsCleaner {
  constructor() {
    this.curInd = 0;
    this.charInd = 0;
    this.allStrings = [];
    this.isIndent = false;
    this.tagsToAvoid = ['', 'a', 'span', 'o:p'];
    this.table1_img_link = 'https://tm--c.na109.content.force.com/servlet/servlet.ImageServer?id=0153f000000UbbU&oid=00D41000000eQtd&lastMod=1592422125000';
    this.wordsToReplace = {
      key: [
        '&nbsp;\n',
        '\n',
        '&nbsp; ',
        '{! table01 }',
      ],
      value: [
        ' ',
        ' ',
        '&nbsp;',
        `<img alt="User-added image" data-cke-saved-src="${this.table1_img_link}" src="${this.table1_img_link}">`,
      ],
    };
    this.evaluateIndent = (attributesInput) => {
      const styleStr = 'style="';
      const textIndentStr = 'text-indent:';
      let indChar = attributesInput.indexOf(styleStr);
      indChar += styleStr.length;
      if (indChar !== -1) {
        const tempAttribues = attributesInput.substr(indChar);
        let posTextIndent = tempAttribues.indexOf(textIndentStr);
        if (posTextIndent !== -1) {
          posTextIndent += textIndentStr.length + 1;
          const endOfValuePosition = tempAttribues.indexOf(';', posTextIndent);
          const valueOfIndent = tempAttribues.substr(posTextIndent, endOfValuePosition - 1);
          if (valueOfIndent.indexOf('0cm') === -1) {
            this.isIndent = true;
          }
        }
      }
    };
  }

  initializeTagsCleaner() {
    this.curInd = 0;
    this.charInd = 0;
    this.allStrings = [];
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
          if (this.isIndent) {
            this.allStrings += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            this.isIndent = false;
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
          this.charInd = this.avoidCharsUntilFindTag('-->', inputText);
          this.isIndent = true;
          breakLoop = true;
        } else {
          attributesTemp += inputText[this.charInd];
          this.charInd += 1;
        }
      } else {
        this.charInd += 1;
      }
    }
    this.evaluateIndent(attributesTemp);
    return attributesTemp.split(' ');
  }

  avoidCharsUntilFindTag(tagToStop, inputText) {
    let curCharInd = this.charInd;
    while (curCharInd < inputText.length) {
      if (inputText.substr(curCharInd, tagToStop.length) === tagToStop) {
        curCharInd += tagToStop.length - 1;
        return curCharInd;
      }
      curCharInd += 1;
    }
    return curCharInd;
  }

  isOpenHtmlComment(inputText) {
    let isOpenComment = false;
    if (inputText.substr(this.charInd, 3) === '!--') {
      isOpenComment = true;
    }
    return isOpenComment;
  }

  isHtmlInputMatchTag(inputText, tag) {
    const curCharInd = this.charInd;
    let isHtmlOpenTag = false;
    if (curCharInd < inputText.length) {
      if (inputText.substr(curCharInd, tag.length) === tag) isHtmlOpenTag = true;
    }
    return isHtmlOpenTag;
  }

  showTagsResult(inputText) {
    const textCleaned = this.getInputTagsCleaned(inputText);
    return textCleaned;
  }
};

TagsCleaner.prototype.curInd = 0;
