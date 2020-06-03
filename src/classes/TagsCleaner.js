class TagsCleaner {
  constructor() {
    this.curInd = 0;
    this.charInd = 0;
  }

  initializeTagsCleaner() {
    this.curInd = 0;
    this.charInd = 0;
  }

  cleanTagsOfInputText(inputText) {
    let tempIntoTags = '';
    let allStrings = [];
    while (this.charInd < inputText.length) {
      if (inputText.charAt(this.charInd) === '<') {
        if (tempIntoTags.length !== 0) { allStrings += tempIntoTags; }
        tempIntoTags = '';

        let tempString = '';
        this.charInd += 1;
        if (this.charInd < inputText.length - 2 &&
              inputText.charAt(this.charInd) === '!' &&
              inputText.charAt(this.charInd + 1) === '-' &&
              inputText.charAt(this.charInd + 2) === '-') {
          while (this.charInd < inputText.length - 2) {
            if (inputText.charAt(this.charInd) === '-' && inputText.charAt(this.charInd + 1) === '-' && inputText.charAt(this.charInd + 2) === '>') { break; }
            this.charInd += 1;
          }
          this.charInd += 3;
        } else if ((this.charInd < inputText.length && inputText.charAt(this.charInd) === 'a') ||
                    (this.charInd < inputText.length - 1 && inputText.charAt(this.charInd) === '/' &&
                      inputText.charAt(this.charInd + 1) === 'a')) {
          while (this.charInd < inputText.length && inputText.charAt(this.charInd) !== '>') {
            this.charInd += 1;
          }
          this.charInd += 1;
        } else {
          while (this.charInd < inputText.length && inputText.charAt(this.charInd) !== '>') {
            tempString += inputText.charAt(this.charInd);
            this.charInd += 1;
          }

          if (inputText.charAt(this.charInd) === '>') {
            const tagAndAttributes = tempString.split(' ');
            const curTag = tagAndAttributes[0];

            allStrings += `<${curTag}>`;

            this.charInd += 1;
          }
        }
      } else {
        let auxChar = ' ';
        if (inputText.charAt(this.charInd) !== '\n') {
          auxChar = inputText.charAt(this.charInd);
        }
        tempIntoTags += auxChar;
        this.charInd += 1;
      }
    }
    return allStrings;
  }

  showTagsResult(inputText) {
    const textCleaned = this.cleanTagsOfInputText(inputText);
    return textCleaned;
  }
}

TagsCleaner.prototype.curInd = 0;
