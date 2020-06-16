class HtmlToXsl extends TagsCleaner {
  constructor() {
    super();
    this.breakLineSymbol = '\n';
    this.tagsToAvoid = ['', 'o:p', 'br'];
    this.wordsToReplace = {
      key: [],
      value: [],
    };
    this.tagsToReplaceObj = ({
      'h1': 'block',
      'h2': 'block',
      'h3': 'block',
      'h4': 'block',
      'h5': 'block',
      '/h1': 'block',
      '/h2': 'block',
      '/h3': 'block',
      '/h4': 'block',
      '/h5': 'block',
      'p': 'block',
      '/p': '/block',
      'ul': 'list-block',
      '/ul': '/list-block',
      'li': 'list-item><list-item-label></list-item-label><list-item-body',
      '/li': '/list-item-body></list-item',
      'span': 'inline',
      '/span': '/inline',
    });
    this.tagsInlineToReplace = {
      key: [
        '<block></block>',
        '<block',
        '<u><b>', '</b></u>',
        '<b><u>', '</u></b>',
        '<u><strong>', '</strong></u>',
        '<strong><u>', '</u></strong>',
        '<u>', '</u>',
        '<b>', '</b>',
        '<strong>', '</strong>',
        '</block>',
      ],
      value: [
        '',
        '<block space-before="4mm" space-after="4mm" ',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '<inline font-weight="bold" text-decoration="underline">', '</inline>',
        '<inline text-decoration="underline">', '</inline>',
        '<inline font-weight="bold">', '</inline>',
        '<inline font-weight="bold">', '</inline>',
        '</block>\n',
      ],
    };
    this.attributesToIdentify = {
      key: ['text-align', 'margin-left'],
      value: ['text-align', 'text-indent'],
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
          ind++;
          attributesResult += ` ${this.attributesToIdentify.value[position]}="${stringOfAttributes[ind]}"`;
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
          const tagMapped = this.tagsToReplaceObj[currentTag];
          if (tagMapped) {
            currentTag = tagMapped;
          }
          const currentAttributes = this.getAttributesFromString(curTagsAttributes);
          if (currentAttributes) {
            currentTag += this.processAttributes(currentAttributes);
          }
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
    console.log(`Tags Cleaned: ${inputTextResult}`);
    return inputTextResult;
  }
}

HtmlToXsl.prototype.charInd = 0;
